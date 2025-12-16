from sqlmodel import SQLModel, create_engine, Session


DB_USER = "postgres"
DB_PASSWORD = "1234" 
DB_HOST = "localhost"
DB_PORT = "5433"      
DB_NAME = "gym_db"


DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)