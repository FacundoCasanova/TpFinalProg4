from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime


class UsuarioBase(SQLModel):
    email: str = Field(unique=True, index=True)
    nombre_completo: Optional[str] = None
    es_activo: bool = True

class Usuario(UsuarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    rutinas: List["Rutina"] = Relationship(back_populates="creador")

class UsuarioCreate(UsuarioBase):
    password: str


class EjercicioBase(SQLModel):
    nombre: str
    dia_semana: str
    series: int
    repeticiones: int
    peso: Optional[float] = None
    notas: Optional[str] = None
    orden: int = 0

class Ejercicio(EjercicioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rutina_id: Optional[int] = Field(default=None, foreign_key="rutina.id")
    rutina: Optional["Rutina"] = Relationship(back_populates="ejercicios")


class RutinaBase(SQLModel):
    nombre: str = Field(index=True)
    descripcion: Optional[str] = None
    es_publica: bool = False

class Rutina(RutinaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)
    
    creador_id: Optional[int] = Field(default=None, foreign_key="usuario.id")
    creador: Optional[Usuario] = Relationship(back_populates="rutinas")
    
    ejercicios: List[Ejercicio] = Relationship(back_populates="rutina", sa_relationship_kwargs={"cascade": "all, delete"})

class RutinaCreate(RutinaBase):
    pass

class RutinaRead(RutinaBase):
    id: int
    fecha_creacion: datetime
    creador_id: int
    ejercicios: List[Ejercicio] = []


class Token(SQLModel):
    access_token: str
    token_type: str