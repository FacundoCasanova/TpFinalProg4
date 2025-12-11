from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from database import get_session
from models import Rutina, RutinaCreate, RutinaRead, Usuario
from auth import get_current_user

router = APIRouter(prefix="/rutinas", tags=["Rutinas"])

# 1. Crear una Rutina (Automáticamente asignada al usuario logueado)
@router.post("/", response_model=RutinaRead, status_code=status.HTTP_201_CREATED)
def crear_rutina(
    rutina: RutinaCreate, 
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    # Creamos la instancia de la base de datos
    nueva_rutina = Rutina.from_orm(rutina)
    # Asignamos el dueño (el usuario que está enviando la petición)
    nueva_rutina.creador_id = current_user.id
    
    session.add(nueva_rutina)
    session.commit()
    session.refresh(nueva_rutina)
    return nueva_rutina

# 2. Leer MIS rutinas (Solo las del usuario logueado)
@router.get("/", response_model=List[RutinaRead])
def leer_mis_rutinas(
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    statement = select(Rutina).where(Rutina.creador_id == current_user.id)
    rutinas = session.exec(statement).all()
    return rutinas

# 3. Eliminar Rutina
@router.delete("/{rutina_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_rutina(
    rutina_id: int,
    session: Session = Depends(get_session),
    current_user: Usuario = Depends(get_current_user)
):
    statement = select(Rutina).where(Rutina.id == rutina_id, Rutina.creador_id == current_user.id)
    rutina = session.exec(statement).first()
    
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada o no tienes permiso")
        
    session.delete(rutina)
    session.commit()