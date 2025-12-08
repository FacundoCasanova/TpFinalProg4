from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import Usuario, UsuarioCreate, Token
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
import os

app = FastAPI(title="Sistema de Gestión de Rutinas")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- ENDPOINTS DE AUTENTICACIÓN ---

@app.post("/registro", response_model=Token)
def registrar_usuario(usuario: UsuarioCreate, session: Session = Depends(get_session)):
    # 1. Verificar si existe
    statement = select(Usuario).where(Usuario.email == usuario.email)
    existe = session.exec(statement).first()
    if existe:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # 2. Crear usuario
    hashed_pwd = get_password_hash(usuario.password)
    nuevo_usuario = Usuario(email=usuario.email, hashed_password=hashed_pwd, nombre_completo=usuario.nombre_completo)
    session.add(nuevo_usuario)
    session.commit()
    session.refresh(nuevo_usuario)
    
    # 3. Loguear automáticamente (devolver token)
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": nuevo_usuario.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
def login_para_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    # Buscar usuario
    statement = select(Usuario).where(Usuario.email == form_data.username)
    user = session.exec(statement).first()
    
    # Verificar
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generar Token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/usuarios/yo", response_model=UsuarioCreate)
def leer_usuario_actual(current_user: Usuario = Depends(get_current_user)):
    return current_user