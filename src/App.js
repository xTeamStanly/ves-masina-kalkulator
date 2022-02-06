import React, { useEffect, useState } from 'react';
import './App.css';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { createTheme, createStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { TimePicker } from '@mui/lab';

import { addHours, setMinutes, getMinutes, getHours, differenceInHours, addMinutes, sub, setHours, addDays } from 'date-fns'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, Paper, Switch } from '@material-ui/core';

import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {

  const [startPranja, setStartPranja] = useState(new Date());
  const [trajanjePranja, setTrajanjePranja] = useState(new Date(0, 0, 0, 2));

  const [vremePocetkaPranja, setVremePocetkaPranja] = useState(setMinutes(setHours(startPranja, 23), 0));
  //if(differenceInHours(vremePocetkaPranja, startPranja) < 0) { setVremePocetkaPranja(addDays(vremePocetkaPranja, 1)); }

  useEffect(() => {
    if(differenceInHours(vremePocetkaPranja, startPranja) < 0) { setVremePocetkaPranja(addDays(vremePocetkaPranja, 1)); }
  }, []);

  const [vremeKrajaPranja, setVremeKrajaPranja] = useState(addHours(startPranja, 2));

  //rezim: dal hocu da biram kad da krene (false) ili kad da uzmem ves (true)
  const [rezim, setRezim] = useState(false);
  const [dijalog, setDijalog] = useState(false);
  const [instrukcije, setInstrukcije] = useState([]);
  const [naslovUpozorenja, setNaslovUpozorenja] = useState("");
  const [upozorenjeDijalog, setUpozorenjeDijalog] = useState(false);

  const daLiJeDatum = (datum) => { return Object.prototype.toString.call(datum) === '[object Date]' }

  const formatirajDatum = (datum) => {
    let sati = datum.getHours();
    sati = ("00" + sati).substr(-2,2);

    let minuti = datum.getMinutes();
    minuti = ("00" + minuti).substr(-2,2);

    return `${sati}:${minuti}`;
  }

  const returnListItem = (ime, vrednost, important, color) => {
    if(color) { return <ListItem key={ime}><b>{ime}:&nbsp;</b> <b style={{color: color}}>{vrednost}</b></ListItem>; }
    if(important && !color) {
      return <ListItem key={ime}><b>{ime}:&nbsp;</b> <b style={{color: 'red'}}>{vrednost}</b></ListItem>;
    }
    return <ListItem key={ime}><b>{ime}:&nbsp;</b> <span>{vrednost}</span></ListItem>;
  }


  return (
    <div className='aplikacija'>
      <div className='naslov'>Veš Mašina Kalkulator</div>
      <div className='vremena'>

        {/* <ThemeProvider theme={tema}> */}
          <LocalizationProvider dateAdapter={ AdapterDateFns }>

          <Paper elevation={24} style={{ padding: '20px' }} >
            <Stack spacing={3}>

              <Paper elevation={1} style={{ padding: '10px' }}>
                <Paper elevation={1} style={{ marginBottom: '10px' }}>
                  <div className='paddedDiv'>
                    <TimePicker
                      label = "Trenutno Vreme"
                      inputFormat = "HH:mm"
                      ampm = { false }
                      value = { startPranja }
                      onChange = { (noviPocetak) => { setStartPranja(noviPocetak); } }
                      showTodayButton = { true }
                      renderInput = {(params) => { return <TextField { ...params } fullWidth={ true } /> }}
                    />
                  </div>

                  <div className='paddedDiv'>
                    <TimePicker
                      label = "Trajanje Pranja"
                      inputFormat = 'HH:mm'
                      ampm = { false }
                      minTime = { new Date(0, 0, 0, 0, 10) } //min pranje 10 minuta
                      maxTime = { new Date(0, 0, 0, 11, 59) } //max pranje 12 sati
                      value = { trajanjePranja }
                      onChange = { (novoTrajanje) => { setTrajanjePranja(novoTrajanje); }}
                      renderInput = {(params) => { return <TextField { ...params } fullWidth={ true } />
                      }}
                    />
                  </div>
                </Paper>

                <Paper elevation={1} style={{ padding: '5px' }}>
                  <div className='paddedDiv'>
                    <Grid container justifyContent="center" style={{ marginBottom: '10px' }}><span className="pitanje">Šta želim da unesem?</span></Grid>
                    <Grid container alignItems="center" justifyContent="center" spacing={2}  >
                      <div className="labela">Vreme početka</div>

                      <Switch
                        checked = { rezim }
                        onChange={()=>{setRezim(!rezim)}}
                      />

                      <div className="labela">Vreme kraja</div>
                    </Grid>
                  </div>
                </Paper>
              </Paper>

              <Paper elevation={2}>

                <div className='paddedDiv'>
                  <Paper hidden = {rezim}>
                    <TimePicker
                      label = "Vreme početka pranja"
                      inputFormat = 'HH:mm'
                      ampm = { false }
                      value = { vremePocetkaPranja }
                      hidden = { rezim }

                      onChange = { (novo) => { setVremePocetkaPranja(novo); }}
                      renderInput = { (params) => { return <TextField { ...params } fullWidth={ true } /> } }
                    />
                  </Paper>

                  <Paper hidden = {!rezim}>
                    <TimePicker
                      label = "Vreme kraja pranja"
                      inputFormat = 'HH:mm'
                      ampm = { false }
                      value = { vremeKrajaPranja }

                      hidden = { !rezim }

                      onChange = { (novo) => { setVremeKrajaPranja(novo); } }
                      renderInput = { (params) => { return <TextField { ...params } fullWidth={ true } /> } }
                    />
                  </Paper>
                </div>

                {/* izracunaj dugme */}
                <div className='paddedDiv'>
                  <Button
                    fullWidth = { true }
                    variant = "contained"
                    color = "primary"
                    onClick={ () => {

                      let validanStart = daLiJeDatum(startPranja);
                      let validnoTrajanje = daLiJeDatum(trajanjePranja);

                      if(getHours(trajanjePranja) * 60 + getMinutes(trajanjePranja) < 10) {
                        setNaslovUpozorenja("Pranje prekratko");
                        setUpozorenjeDijalog(true);
                        return;
                      }

                      //znam vreme pocetka pranja
                      if(rezim === false) {

                        let validanPocetak = daLiJeDatum(vremePocetkaPranja);
                        if(!validanStart || !validnoTrajanje || !validanPocetak) {
                          setNaslovUpozorenja("Ponovo proverite unešeno vreme");
                          setUpozorenjeDijalog(true);
                          return;
                        }

                        //trenutno vreme
                        let trenutnoVreme = startPranja;

                        //koliko dugo traje pranje
                        let duzinaPranja = { sat: getHours(trajanjePranja), minut: getMinutes(trajanjePranja) };

                        //kad zelim da pranje krene
                        let vremeStarta = vremePocetkaPranja;

                        let vremeKraja = addMinutes(addHours(vremeStarta, duzinaPranja.sat), duzinaPranja.minut);

                        let tajmerNaMasini = differenceInHours(vremeKraja, trenutnoVreme, { roundingMethod: 'ceil' });

                        if(tajmerNaMasini < 0) { tajmerNaMasini += 24; } //posto prikazujemo samo sate i minute, ako je nesto manje racunaj da je u pitanju sledeci dan

                        if(tajmerNaMasini > 23) {
                          setNaslovUpozorenja("Previše kasno, maksimum tajmera je 24h")
                          setUpozorenjeDijalog(true);
                          return;
                        }

                        //provera dal je pranje moguce, unazad, tajmer mora da bude veci od duzine pranja
                        if(tajmerNaMasini * 60 < duzinaPranja.minut + duzinaPranja.sat * 60) {
                          setNaslovUpozorenja("Previše rano, tajmer biti duži od dužine pranja")
                          setUpozorenjeDijalog(true);
                          return;
                        }

                        let stvarnoVremeKraja = addHours(trenutnoVreme, tajmerNaMasini);

                        setInstrukcije([
                          { name: 'Trenutno Vreme', value: formatirajDatum(trenutnoVreme), important: false },
                          { name: 'Trajanje Pranja', value: `${duzinaPranja.sat}h ${duzinaPranja.minut}min`, imporant: false },
                          { name: 'Odabran Početak', value: formatirajDatum(vremeStarta), important: false},
                          { name: 'Početak Pranja', value: formatirajDatum(sub(stvarnoVremeKraja, { hours: duzinaPranja.sat, minutes: duzinaPranja.minut })), important: true },
                          { name: 'Kraj Pranja', value: formatirajDatum(stvarnoVremeKraja), important: true },
                          { name: 'Tajmer', value: `${tajmerNaMasini}h`, important: true, color: 'darkgreen' }
                        ]);

                      } else {

                        let validanKraj = daLiJeDatum(vremeKrajaPranja);
                        if(!validanStart || !validnoTrajanje || !validanKraj) {
                          setNaslovUpozorenja("Ponovo proverite unešeno vreme");
                          setUpozorenjeDijalog(true);
                          return;
                        }

                        let trenutnoVreme = startPranja;
                        let duzinaPranja = { sat: getHours(trajanjePranja), minut: getMinutes(trajanjePranja) };
                        let vremeKraja = vremeKrajaPranja;

                        //razlika izmedju vremeKraja - trenutnoVreme
                        let tajmerNaMasini = differenceInHours(vremeKraja, trenutnoVreme, { roundingMethod: 'ceil' });

                        console.log(tajmerNaMasini);

                        //ako je tajmer negativan znaci da je trenutnoVreme posle vremenaKraja
                        //tako da racunamo da je to onda sledeci dan
                        if(tajmerNaMasini < 0) { tajmerNaMasini += 24; addDays(vremeKraja, 1); }



                        let tajmerMinuti = tajmerNaMasini * 60;
                        let duzinaPranjaMinuti = duzinaPranja.sat * 60 + duzinaPranja.minut;
                        if(tajmerMinuti - duzinaPranjaMinuti < 0) {
                          setNaslovUpozorenja("Previše kratko vreme kraja pranja");
                          setUpozorenjeDijalog(true);
                          return;
                        }

                        console.log(tajmerNaMasini);
                        console.log("");
                        console.log("");

                        if(tajmerNaMasini > 23) {
                          setNaslovUpozorenja("Previše dugo, maksimum tajmera je 24h")
                          setUpozorenjeDijalog(true);
                          return;
                        }

                        let stvarnoVremeKraja = addHours(trenutnoVreme, tajmerNaMasini);

                        setInstrukcije([
                          { name: 'Trenutno Vreme', value: formatirajDatum(trenutnoVreme), important: false },
                          { name: 'Trajanje Pranja', value: `${duzinaPranja.sat}h ${duzinaPranja.minut}min`, imporant: false },
                          { name: 'Odabran Kraj', value: formatirajDatum(vremeKraja), important: false},
                          { name: 'Početak Pranja', value: formatirajDatum(sub(stvarnoVremeKraja, { hours: duzinaPranja.sat, minutes: duzinaPranja.minut })), important: true },
                          { name: 'Kraj Pranja', value: formatirajDatum(stvarnoVremeKraja), important: true },
                          { name: 'Tajmer', value: `${tajmerNaMasini}h`, important: true, color: 'darkgreen' }
                        ]);

                      }

                      setDijalog(true);
                    }}
                  >Izračunaj 🧺</Button></div>

                <Dialog open={ upozorenjeDijalog } TransitionComponent={Transition} fullWidth>
                  <DialogTitle style={{ color: 'red', textAlign: 'center' }} >💥 {naslovUpozorenja} 💥</DialogTitle>
                  <DialogContent>
                    <DialogActions>
                      <Button variant="contained" color="primary" fullWidth={true} onClick={ () => { setUpozorenjeDijalog(false); }}>Nazad</Button>
                    </DialogActions>
                  </DialogContent>
                </Dialog>

                <Dialog open={ dijalog } TransitionComponent={Transition} fullWidth>
                  <DialogTitle style={{fontWeight: 'bold', textAlign: 'center'}} >🧮 Računica 🧮</DialogTitle>
                  <DialogContent style={{marginTop: '0px', paddingTop: '0px'}}>
                    <List>
                      {instrukcije.map(item => returnListItem(item.name, item.value, item.important, item.color))}
                    </List>
                    <DialogActions>
                      <Button variant="contained" color="primary" fullWidth={true} onClick={ () => { setDijalog(false); }}>Nazad</Button>
                    </DialogActions>
                  </DialogContent>
                </Dialog>

              </Paper>

            </Stack>
          </Paper>
          </LocalizationProvider>
        {/* </ThemeProvider> */}
      </div>
      <Paper className="copyFooter">😎 Stamen Feb. 2022.</Paper>
    </div>
  );
}

export default App;
