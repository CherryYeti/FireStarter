@echo off

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo Setup complete. You can now run your application.
