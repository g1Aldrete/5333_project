import { Link } from "react-router-dom";

function Register() {
    return (
        <>
            <div className="register">
                <form className="form">
                    <h2>Register</h2>
                    <label>Email</label>
                    <input type="email" id="email" name="email" required></input>
                    <label>Password</label>
                    <input type="password" id="password" name="password" required></input>
                    <label>First Name</label>
                    <input type="text" id="fname" name="fname" required></input>
                    <label>Last Name</label>
                    <input type="text" id="lname" name="lname" required></input>
                    <label>Phone Number</label>
                    <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"></input>
                    <button>Register</button>
                    <p>Already have an account? <Link to="/login">Log In</Link></p>
                </form>
            </div>
        </>
    );
}

export default Register;