FROM python:3.11

WORKDIR /backend

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]

