const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// SQLite veritabanı bağlantısı
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')

function getDb() {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('SQLite bağlantı hatası:', err.message)
    } else {
      console.log('SQLite veritabanına bağlandı')
    }
  })
}

// Promise wrapper for SQLite operations
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDb()
    db.run(sql, params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ lastID: this.lastID, changes: this.changes })
      }
      db.close()
    })
  })
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDb()
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
      db.close()
    })
  })
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDb()
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
      db.close()
    })
  })
}

// Message tablosunu oluştur (eğer yoksa)
async function initMessageTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS Message (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      senderId TEXT NOT NULL,
      receiverId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senderId) REFERENCES User (id),
      FOREIGN KEY (receiverId) REFERENCES User (id)
    )
  `
  
  try {
    await runQuery(createTableSQL)
    console.log('Message tablosu hazır')
  } catch (error) {
    console.error('Message tablosu oluşturma hatası:', error)
  }
}

// Mesaj gönderme
async function createMessage({ subject, content, senderId, receiverId }) {
  const id = Math.random().toString(36).substring(2) + Date.now().toString(36)
  
  const sql = `
    INSERT INTO Message (id, subject, content, senderId, receiverId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `
  
  try {
    const result = await runQuery(sql, [id, subject, content, senderId, receiverId])
    return { id, subject, content, senderId, receiverId, isRead: false }
  } catch (error) {
    throw new Error('Mesaj oluşturma hatası: ' + error.message)
  }
}

// Gelen mesajları getir
async function getInboxMessages(userId) {
  const sql = `
    SELECT 
      m.*,
      u.name as senderName,
      u.email as senderEmail
    FROM Message m
    JOIN User u ON m.senderId = u.id
    WHERE m.receiverId = ?
    ORDER BY m.createdAt DESC
  `
  
  try {
    const messages = await allQuery(sql, [userId])
    return messages.map(msg => ({
      id: msg.id,
      subject: msg.subject,
      content: msg.content,
      isRead: Boolean(msg.isRead),
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      sender: {
        id: msg.senderId,
        name: msg.senderName,
        email: msg.senderEmail
      }
    }))
  } catch (error) {
    console.error('Gelen mesajları getirme hatası:', error)
    return []
  }
}

// Gönderilen mesajları getir
async function getSentMessages(userId) {
  const sql = `
    SELECT 
      m.*,
      u.name as receiverName,
      u.email as receiverEmail
    FROM Message m
    JOIN User u ON m.receiverId = u.id
    WHERE m.senderId = ?
    ORDER BY m.createdAt DESC
  `
  
  try {
    const messages = await allQuery(sql, [userId])
    return messages.map(msg => ({
      id: msg.id,
      subject: msg.subject,
      content: msg.content,
      isRead: Boolean(msg.isRead),
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      receiver: {
        id: msg.receiverId,
        name: msg.receiverName,
        email: msg.receiverEmail
      }
    }))
  } catch (error) {
    console.error('Gönderilen mesajları getirme hatası:', error)
    return []
  }
}

// Mesajı okundu olarak işaretle
async function markAsRead(messageId, userId) {
  const sql = `
    UPDATE Message 
    SET isRead = 1, updatedAt = datetime('now')
    WHERE id = ? AND receiverId = ?
  `
  
  try {
    await runQuery(sql, [messageId, userId])
    return true
  } catch (error) {
    console.error('Mesajı okundu işaretleme hatası:', error)
    return false
  }
}

// Mesaj silme
async function deleteMessage(messageId, userId) {
  const sql = `
    DELETE FROM Message 
    WHERE id = ? AND (senderId = ? OR receiverId = ?)
  `
  
  try {
    await runQuery(sql, [messageId, userId, userId])
    return true
  } catch (error) {
    console.error('Mesaj silme hatası:', error)
    return false
  }
}

// Kullanıcı email ile arama
async function findUserByEmail(email) {
  const sql = `SELECT id, name, email FROM User WHERE email = ?`
  
  try {
    const user = await getQuery(sql, [email])
    return user
  } catch (error) {
    console.error('Kullanıcı arama hatası:', error)
    return null
  }
}

module.exports = {
  initMessageTable,
  createMessage,
  getInboxMessages,
  getSentMessages,
  markAsRead,
  deleteMessage,
  findUserByEmail
} 