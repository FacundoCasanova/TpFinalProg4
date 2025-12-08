from sqlmodel import SQLModel, create_engine, Session

# --- CONFIGURACIÓN MANUAL ---
# Usamos los datos que sabemos que funcionan en tu PC
DB_USER = "postgres"
DB_PASSWORD = "1234" 
DB_HOST = "localhost"
DB_PORT = "5433"      
DB_NAME = "gym_db"

# Armamos la URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# echo=True muestra lo que pasa en la base de datos
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)