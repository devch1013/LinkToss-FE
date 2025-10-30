require('dotenv').config({ path: '.env.local' });

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// 환경변수에서 설정 가져오기
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'i18n';

// Service Account 인증 정보
let auth;
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
} else if (fs.existsSync('service-account.json')) {
  auth = new google.auth.GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
} else {
  console.error('❌ Error: Service Account credentials not found.');
  console.error('   Set GOOGLE_SERVICE_ACCOUNT_JSON in .env.local or create service-account.json');
  process.exit(1);
}

if (!SPREADSHEET_ID) {
  console.error('❌ Error: GOOGLE_SHEET_ID must be set in .env.local');
  process.exit(1);
}

async function pushTranslations() {
  try {
    console.log('📤 Pushing translations to Google Sheets...');
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // JSON 파일들 읽기
    const localesDir = path.join(__dirname, '../src/i18n/locales');
    const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));
    
    if (files.length === 0) {
      console.error('❌ No JSON files found in src/i18n/locales/');
      return;
    }

    // 모든 언어의 데이터 로드
    const languages = {};
    const allKeys = new Set();
    
    files.forEach(file => {
      const lang = file.replace('.json', '');
      const filePath = path.join(localesDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      const flatData = flattenObject(data);
      languages[lang] = flatData;
      
      // 모든 키 수집
      Object.keys(flatData).forEach(key => allKeys.add(key));
    });

    // 정렬된 키 배열
    const sortedKeys = Array.from(allKeys).sort();
    const langList = Object.keys(languages).sort();
    
    // 스프레드시트 데이터 생성
    const rows = [
      ['key', ...langList], // 헤더
      ...sortedKeys.map(key => [
        key,
        ...langList.map(lang => languages[lang][key] || '')
      ])
    ];

    // 기존 데이터 삭제 후 새로 쓰기
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: rows,
      },
    });

    console.log(`✅ Pushed ${sortedKeys.length} translations for ${langList.length} languages`);
    console.log(`   Languages: ${langList.join(', ')}`);
    console.log('🎉 Translations pushed successfully!');
  } catch (error) {
    console.error('❌ Error pushing translations:', error.message);
    if (error.code === 403) {
      console.error('   Make sure the Service Account has edit access to the spreadsheet!');
    }
    process.exit(1);
  }
}

// 중첩된 객체를 flat하게 변환하는 헬퍼 함수
function flattenObject(obj, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

pushTranslations();

