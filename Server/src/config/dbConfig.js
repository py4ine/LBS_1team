// import pg from 'pg'

// const NODE_ENV = process.env.NODE_ENV || 'development';

// // 환경 변수 확인
// console.log('NODE_ENV:', NODE_ENV);

// let hostAddress;
// if (process.env.NODE_ENV === 'production') {
//     const hostAddress = '1.230.106.16';
//     const user = 'user1';
// } else {
//     const hostAddress = 'localhost';
//     const user = 'codelab';
// }

// const dbConfig = {
//     host: hostAddress,
//     port: 5432,
//     database: 'postgres',
//     user: user,
//     password: 'codelab1234'
// };

// export const db = new pg.Pool(dbConfig);
// export const schema = 'jwkim';


import pg from 'pg'

const dbConfig = {
    host : '1.230.106.16',
    port : 5432,
    database : 'postgres',
    user : 'codelab',
    password : 'codelab1234',
};

export const db = new pg.Pool(dbConfig);
export const schema = 'team1';