function randomPassword() {
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@$%^&*()_-=+,."
    let pass = "";
    for(let i = 0; i< 8;i++)
    {
        pass+= characters[Math.floor(Math.random() * characters.length)];
    }
    return pass;
}
module.exports = {randomPassword};