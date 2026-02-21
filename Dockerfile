FROM python:3.9-slim

WORKDIR /app

COPY ["Project Ipl/cricket-predictor-advanced/backend/requirements.txt", "./requirements.txt"]
RUN pip install --no-cache-dir -r requirements.txt

COPY ["Project Ipl/cricket-predictor-advanced/backend/", "./"]

ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT:-5000}"]
