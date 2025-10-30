require('dotenv').config({ path: '.env.local' });

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// 환경변수에서 설정 가져오기
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'i18n';

if (!SPREADSHEET_ID || !API_KEY) {
  console.error('❌ Error: GOOGLE_SHEET_ID and GOOGLE_API_KEY must be set in .env.local');
  process.exit(1);
}

async function syncTranslations() {
  try {
    console.log('📥 Fetching translations from Google Sheets...');
    
    const sheets = google.sheets({ version: 'v4', auth: API_KEY });
    
    // 스프레드시트에서 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.error('❌ No data found in spreadsheet');
      return;
    }

    // 첫 번째 행은 헤더 (key, ko, en, ...)
    const headers = rows[0];
    const keyIndex = headers.indexOf('key');
    
    if (keyIndex === -1) {
      console.error('❌ "key" column not found in spreadsheet');
      return;
    }

    // 언어별 객체 초기화
    const translations = {};
    headers.forEach((lang, index) => {
      if (lang !== 'key' && lang.trim() !== '') {
        translations[lang] = {};
      }
    });

    // 데이터 파싱
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const key = row[keyIndex];
      
      if (!key || key.trim() === '') continue;

      headers.forEach((lang, index) => {
        if (lang !== 'key' && lang.trim() !== '' && translations[lang]) {
          const value = row[index] || '';
          setNestedValue(translations[lang], key, value);
        }
      });
    }

    // JSON 파일로 저장
    const localesDir = path.join(__dirname, '../src/i18n/locales');
    
    for (const [lang, data] of Object.entries(translations)) {
      const filePath = path.join(localesDir, `${lang}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`✅ Updated ${lang}.json`);
    }

    console.log('🎉 Translations synced successfully!');
  } catch (error) {
    console.error('❌ Error syncing translations:', error.message);
    process.exit(1);
  }
}

// 중첩된 키를 객체에 설정하는 헬퍼 함수 (예: "common.loading" -> { common: { loading: "..." } })
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

syncTranslations();

