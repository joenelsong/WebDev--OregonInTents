function validatePasswords() {
    var password = document.querySelector("input[name='password']").value;
    var passwordReenter = document.querySelector("input[name='passwordVerify']").value;
    
    if (password !== passwordReenter) {
        alert("Error: Passwords must match!");
        return false;
    }
    return true;
}