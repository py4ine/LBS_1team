import app from '../app.js'

const main = async () => {
    const PORT = '8080';
    app.listen(parseInt(PORT, 10), function() {
        console.log(`Server on PORT ${PORT}`);
    });
}

main();