import pg from 'pg'

const NODE_ENV = process.env.NODE_ENV || 'development';

// 환경 변수 확인
console.log('NODE_ENV:', NODE_ENV);

let hostAddress;
if (process.env.NODE_ENV === 'production') {
    hostAddress = '';
} else {
    hostAddress = 'localhost';
}

const dbConfig = {
    host: hostAddress,
    port: 5432,
    database: 'postgres',
    user: 'user1',
    password: 'codelab1234'
};

export const db = new pg.Pool(dbConfig);
export const schema = 'jwkim';