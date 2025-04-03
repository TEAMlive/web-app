from pathlib import Path


ROOT_DIR = Path(__file__).parent.parent

BASE_DIR = Path(__file__).parent.parent.parent.parent
ENV_FILE_PATH = BASE_DIR.parent.joinpath('.env')