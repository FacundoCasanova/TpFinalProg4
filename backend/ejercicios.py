from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from database import get_session
from models import Ejercicio, EjercicioBase, Rutina, Usuario
from auth import get_current_user

router = APIRouter(prefix="/ejercicios", tags=["Ejercicios"])


@router.post("/", response_model=Ejercicio)
def agregar_ejercicio(
    ejercicio: EjercicioBase, 
    rutina_id: int, 
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
   
    rutina = session.get(Rutina, rutina_id)
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    if rutina.creador_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para editar esta rutina")

   
    nuevo_ejercicio = Ejercicio.from_orm(ejercicio)
    nuevo_ejercicio.rutina_id = rutina_id
    
    session.add(nuevo_ejercicio)
    session.commit()
    session.refresh(nuevo_ejercicio)
    return nuevo_ejercicio


@router.delete("/{ejercicio_id}")
def eliminar_ejercicio(
    ejercicio_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    ejercicio = session.get(Ejercicio, ejercicio_id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    
    
    rutina = session.get(Rutina, ejercicio.rutina_id)
    if rutina.creador_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso")

    session.delete(ejercicio)
    session.commit()
    return {"ok": True}


@router.get("/{rutina_id}", response_model=List[Ejercicio])
def listar_ejercicios(
    rutina_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
   
    rutina = session.get(Rutina, rutina_id)
    if not rutina or rutina.creador_id != current_user.id:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
        
    statement = select(Ejercicio).where(Ejercicio.rutina_id == rutina_id).order_by(Ejercicio.dia_semana, Ejercicio.orden)
    return session.exec(statement).all()