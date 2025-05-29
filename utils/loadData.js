const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const Property = require('../models/property')

const importCsvToMongo = async (csvFilePath) => {
  const records = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const adminUserId = "64f3c2f8a5d9c6b2e8a9f123"; 
        row.userId = new mongoose.Types.ObjectId(adminUserId);

        if (row.isVerified) {
            row.isVerified = row.isVerified.toLowerCase() === 'true';
        }
        records.push(row);
      })
      .on('end', async () => {
        try {
          const result = await Property.insertMany(records);
          console.log(`${result.length} records inserted.`);
          resolve(result);
        } catch (error) {
          console.error('Error inserting records:', error);
          reject(error);
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      });
  });
};

module.exports = importCsvToMongo;
