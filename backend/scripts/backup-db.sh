#!/bin/bash
DATE=$(date +%F)
BACKUP_DIR="/backups/mangadb"
MONGO_URI="mongodb://user:password@localhost:27017/mangadb"

mkdir -p $BACKUP_DIR
mongodump --uri $MONGO_URI --out $BACKUP_DIR/$DATE

# Compactar e remover backups antigos (+7 dias)
tar -czf $BACKUP_DIR/$DATE.tar.gz $BACKUP_DIR/$DATE
rm -rf $BACKUP_DIR/$DATE
find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +7 -delete 