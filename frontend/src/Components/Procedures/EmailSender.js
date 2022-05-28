import React, { useContext } from "react";

import { GlobalContext } from "./../../Context";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import { useState } from "react";

import "../../index.css";

function EmailSender(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [letter, setLetter] = useState(""); // Hook for creating letter
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [procValueErr, setProcValueErr] = useState(false);
  const { proceduresValue, setProceduresValue } = useContext(GlobalContext); // Catches chosen Procedures in Tabel


  const handleRequest = async (e) => {
    e.preventDefault(); // stops the default action of a selected element
    // Email validation
    const regexTest = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/g);

    setNameError("");
    setEmailError(false);
    setSubjectError(false);

    //  Form validation
    name === "" ? setNameError(true) : setName("");

    !email.match(regexTest) ? setEmailError(true) : setEmail("");

    subject === "" ? setSubjectError(true) : setSubject("");

    // Chosed procedures looping for API URL integration and loading
    // Take props, mapp it and with query param join
    const chosenProcedures = proceduresValue.map((n) => `${n}`).join(", ");
    // Error Component

    // Loading  is true if...
    if (
      name &&
      email &&
      subject &&
      chosenProcedures !== "" &&
      email.match(regexTest)
    ) {
      setLoading(true); // Set the fraise and then use Axios

       // Adding array of procedures to Rest Api, if Checkbox is checked - add to Api
       console.log({ email, message, name, subject }); // TODO see the object in console

       // Rest Api with query parameters
       const response = await axios
         .post(
           `http://localhost:4000/api/mail/sendmail?name=${name}&email=${email}&subject=${subject}&message=${message}&procedures=${chosenProcedures}`
         )
         .then((res) => {
           setLetter(response.data);
           alert("Email Sent Successfully");
 
           console.log(res);
           console.log(setProceduresValue);
           console.log(letter);
         });
     } else if (!chosenProcedures) {
       setProcValueErr(true);
       console.log(procValueErr);
     }
   };

  return (
    <form onSubmit={handleRequest} method="POST">
      <Typography 
      variant="h6" 
      component="div" 
      gutterBottom 
      mt={7} 
      mb={3}>
      {loading
          ? "Kiri on saadetud!"
          : setProcValueErr
          ? "* Palun sisestage andmed, et saada tulemus oma eposti aadressile. "
          : "Valige protseduurid ja täitke vormi, et saada otsimise tulemus oma emailile"}
      </Typography>

      <Grid container spacing={2}>
        {/* --------------------- Name ---------------------------- */}

        <Grid item md={6}>
          <Tooltip
            title={<Typography fontSize={20}>Sisestage nimi</Typography>}
          >
            <Box >
              <TextField
                // data-private Hides Input Data in LogRocket Video
                data-private="lipsum"
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                variant="outlined"
                label="Sinu nimi"
                fullWidth
                autoComplete="name"
                error={nameError}
                required
              />
            </Box>
          </Tooltip>
        </Grid>

        {/* ---------------------- Email with validation -------------------- */}

        <Grid item xs={12} sm={6} md={6}>
          <Tooltip
            title={
              <Typography fontSize={20}>Sisestage e-posti aadress</Typography>
            }
          >
            <Box>
              <TextField
                // data-private Hides Input Data in LogRocket Video
                data-private="lipsum"
                id="email"
                data-testid="email-input"
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                variant="outlined"
                label="E-post"
                fullWidth
                autoComplete="email"
                error={emailError}
                required
              />
              {email &&
                !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/g.test(email) && (
                  <span className="error" data-testid="error-msg">
                    Palun sisestage aadress õigesti.
                  </span>
                )}
            </Box>
          </Tooltip>
        </Grid>
      </Grid>

      {/* ------------------------------- Second grid with subject and message ---------------------------- */}

      <Grid container spacing={2} style={{ marginTop: 15}}>
        {/* ------------------------- Subject  -------------------------- */}

        <Grid item md={6}>
          <Tooltip
            title={<Typography fontSize={20}>Sisestage pealkiri</Typography>}
          >
            <Box>
              <TextField
                // data-private Hides Input Data in LogRocket Video
                data-private="lipsum"
                id="subject"
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                variant="outlined"
                label='Nimeta otsingutulemus nt. "Protseduurid
                lihaspingetele kuni 50 eur"'
                fullWidth
                error={subjectError}
                required
              />
            </Box>
          </Tooltip>
        </Grid>

        {/* -------------------------- Message  -------------------------- */}

        <Grid item xs={12} sm={6} >
          <Tooltip
            title={<Typography fontSize={20}>Sisestage lisamärkused</Typography>}
          >
           
            <TextField
              // data-private Hides Input Data in LogRocket Video
              id="message"
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              label="Lisamärkused"
              multiline
              rows={3}
            />
          
          </Tooltip>
        </Grid>
      </Grid>
      {/* ------------------------- Button --------------------------------- */}
      <Grid item xs={12} sm={6} md={6} style={{ marginTop: -18}}>
        <Button
          id="buttonEmail"
          data-testid="button"
          disabled={!name || !email || !subject}
          onClick={() => {
            handleRequest(name, email, subject, message);
          }}
          type="submit"
          variant="contained"
        >
          SAADA E-POSTILE
        </Button>
      </Grid>
    </form>
  );
}

export default EmailSender;
