FROM python:3.9-slim

WORKDIR /app

COPY ["Project Ipl/cricket-predictor-advanced/backend/requirements.txt", "./requirements.txt"]
RUN pip install --no-cache-dir -r requirements.txt

COPY ["Project Ipl/cricket-predictor-advanced/backend/", "./"]

ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["sh", "-c", "gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} --timeout 60 app:app"]
