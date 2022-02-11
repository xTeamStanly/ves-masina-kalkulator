import './App.css';

import { daLiJeDatum, formatirajDatum,returnListItem } from './lib/tools';
import React, { useState, useEffect } from 'react';

import makeStyles from '@mui/styles/makeStyles';
import Slide from '@mui/material/Slide';
import { addHours, setMinutes, getMinutes, getHours, differenceInHours, addMinutes, sub, setHours, addDays } from 'date-fns';
import { LocalizationProvider, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { deepPurple, purple } from '@mui/material/colors';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, Switch, TextField, Typography } from '@mui/material';

const useStyles = makeStyles({
  root: {
    background: 'rgba(147, 112, 216, 0.6)',
    borderRadius: 4,
    boxShadow: '0 3px 5px 2px rgba(120, 120, 120, .3)',
  }
});

const TransitionSlide = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const tema = createTheme({
  palette: {
    primary: purple,
    secondary: deepPurple
  }
});

function App() {

  const classes = useStyles();

  const [startPranja, setStartPranja] = useState(new Date());
  const [trajanjePranja, setTrajanjePranja] = useState(new Date(0, 0, 0, 2));
  const [vremePocetkaPranja, setVremePocetkaPranja] = useState(setMinutes(setHours(startPranja, 23), 0));

  //samo jednom pri inicijalizaciji
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

  const showDialogWithTitle = (title) => {
    setNaslovUpozorenja(title);
    setUpozorenjeDijalog(true);
  }

  return (
    <div className='aplikacija'>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={tema}>
          <div className='naslov'>
            <Typography
              fontSize={'3em'}
              variant='button'
              color={'purple'}
              fontWeight={'bold'}
            >Veš Mašina Kalkulator</Typography>
          </div>

          <div className='unos'>

            <div className='unosVreme'>
              <TimePicker
                label='Trenutno Vreme'
                inputFormat='HH:mm'
                ampm={false}
                value={startPranja}
                okText={'Potvrdi'}
                cancelText={'Poništi'}
                todayText={'Sad'}
                onChange={ (novaVrednost) => { setStartPranja(novaVrednost); } }
                showTodayButton={true}
                renderInput={ (params) => {
                  return (
                    <TextField
                      { ...params }
                      InputLabelProps={{ color: 'secondary', sx: { color: 'purple', fontWeight: 'bold' } }}
                      className={classes.root}
                      fullWidth={true}
                    />
                  );
                }}
              />
            </div>

            <div className='unosVreme'>
              <TimePicker
                label='Trajanje Pranja'
                inputFormat='HH:mm'
                ampm={false}
                minTime={new Date(0, 0, 0, 0, 10)} //min pranje traje 10 minuta
                maxTime={new Date(0, 0, 0, 11, 59)} //max pranje traje 12 sati
                value={trajanjePranja}
                okText={'Potvrdi'}
                cancelText={'Poništi'}
                onChange={ (novaVrednost) => { setTrajanjePranja(novaVrednost); } }
                renderInput={ (params) => {
                  return (
                    <TextField
                      { ...params }
                      InputLabelProps={{ color: 'secondary', sx: { color: 'purple', fontWeight: 'bold' } }}
                      className={classes.root}
                      fullWidth={true}
                    />
                  );
                }}
              />
            </div>

            <div className='unosRezim'>

              <Typography
                align='center'
                marginBottom={'10px'}
                fontWeight={'bold'}
                color={'purple'}
              >Šta želim da unesem?</Typography>

              <Grid container alignItems="center" justifyContent="center" spacing={2}  >
                <div className="labela"><Typography color={'secondary'} fontWeight={'bold'} >Vreme početka</Typography></div>

                <Switch
                  checked={rezim}
                  color='primary'
                  onChange={()=>{setRezim(!rezim)}}
                />

                <div className="labela"><Typography color={'secondary'} fontWeight={'bold'} >Vreme kraja</Typography></div>
              </Grid>
            </div>

            <div className='unosPodaci'>

              <div className='unosVreme' hidden={rezim}>
                <TimePicker
                  label='Vreme početka pranja'
                  inputFormat='HH:mm'
                  ampm={false}
                  value={vremePocetkaPranja}
                  okText={'Potvrdi'}
                  cancelText={'Poništi'}
                  onChange={ (novaVrednost) => { setVremePocetkaPranja(novaVrednost); } }
                  renderInput={ (params) => {
                    return (
                      <TextField
                        { ...params }
                        InputLabelProps={{ color: 'secondary', sx: { color: 'purple', fontWeight: 'bold' } }}
                        className={classes.root}
                        fullWidth={true}
                      />
                    );
                  }}
                />
              </div>

              <div className='unosVreme' hidden={!rezim}>
                <TimePicker
                  label='Vreme kraja pranja'
                  inputFormat='HH:mm'
                  ampm={false}
                  value={vremeKrajaPranja}
                  okText={'Potvrdi'}
                  cancelText={'Poništi'}
                  onChange={ (novaVrednost) => { setVremeKrajaPranja(novaVrednost); } }
                  renderInput={ (params) => {
                    return (
                      <TextField
                        { ...params }
                        InputLabelProps={{ color: 'secondary', sx: { color: 'purple', fontWeight: 'bold' } }}
                        className={classes.root}
                        fullWidth={true}
                      />
                    );
                  }}
                />
              </div>

            </div>

            <div className='izracunajDugme'>
              <Button
                variant='contained'
                fullWidth={true}
                color='primary'
                onClick={ () => {

                  let validanStart = daLiJeDatum(startPranja);
                  let validnoTrajanje = daLiJeDatum(trajanjePranja);

                  if(!validanStart || !validnoTrajanje) { showDialogWithTitle('Ponovo proverite unešeno vreme'); return; }

                  if(getHours(trajanjePranja) * 60 + getMinutes(trajanjePranja) < 10) { showDialogWithTitle('Pranje prekratko'); return; }

                  //znam vreme pocetka pranja
                  if(rezim === false) {
                    let validanPocetak = daLiJeDatum(vremePocetkaPranja);
                    if(!validanPocetak) { showDialogWithTitle('Ponovo proverite unešeno vreme'); return; }

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
                      showDialogWithTitle("Previše kasno, maksimum tajmera je 24h")
                      return;
                    }

                    //provera dal je pranje moguce, unazad, tajmer mora da bude veci od duzine pranja
                    if(tajmerNaMasini * 60 < duzinaPranja.minut + duzinaPranja.sat * 60) {
                      showDialogWithTitle("Previše rano, tajmer mora biti duži od dužine pranja")
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
                    if(!validanKraj)  { showDialogWithTitle('Ponovo proverite unešeno vreme'); return; }

                    let trenutnoVreme = startPranja;
                    let duzinaPranja = { sat: getHours(trajanjePranja), minut: getMinutes(trajanjePranja) };
                    let vremeKraja = vremeKrajaPranja;

                    //razlika izmedju vremeKraja - trenutnoVreme
                    let tajmerNaMasini = differenceInHours(vremeKraja, trenutnoVreme, { roundingMethod: 'ceil' });

                    //ako je tajmer negativan znaci da je trenutnoVreme posle vremenaKraja
                    //tako da racunamo da je to onda sledeci dan
                    if(tajmerNaMasini < 0) { tajmerNaMasini += 24; addDays(vremeKraja, 1); }

                    let tajmerMinuti = tajmerNaMasini * 60;
                    let duzinaPranjaMinuti = duzinaPranja.sat * 60 + duzinaPranja.minut;

                    if(tajmerMinuti - duzinaPranjaMinuti < 0) {
                      showDialogWithTitle("Previše kratko vreme kraja pranja");
                      return;
                    }

                    if(tajmerNaMasini > 23) {
                      showDialogWithTitle("Previše dugo, maksimum tajmera je 24h")
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
              >
                <Typography
                  color='white'
                  fontWeight={'bold'}
                  fontSize={'large'}
                >Izračunaj 🧺</Typography>
              </Button>
            </div>

            <Dialog
              open={upozorenjeDijalog}
              TransitionComponent={TransitionSlide}
              fullWidth={true}
            >
              <DialogTitle style={{fontWeight: 'bold', textAlign: 'center', backgroundColor: 'purple', color: 'white'}}>{naslovUpozorenja}</DialogTitle>

              <DialogContent style={{ marginTop: '20px'}}>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={true}
                    onClick={ () => { setUpozorenjeDijalog(false); }}>Nazad</Button>
                </DialogActions>
              </DialogContent>
            </Dialog>

            <Dialog
              open={dijalog}
              TransitionComponent={TransitionSlide}
              fullWidth={true}
            >
              <DialogTitle style={{fontWeight: 'bold', textAlign: 'center', backgroundColor: 'purple', color: 'white'}}>🧮 Računica 🧮</DialogTitle>

              <DialogContent style={{marginTop: '20px', paddingTop: '0px'}}>

                <List>
                  {instrukcije.map(item => returnListItem(item.name, item.value, item.important, item.color))}
                </List>

                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={true}
                    onClick={ () => { setDijalog(false); }}>Nazad</Button>
                </DialogActions>

              </DialogContent>
            </Dialog>
          </div>

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Typography
              style={{
                width: '200px',
                margin: '20px',
                padding: '5px',
                backgroundColor: 'rgba(147, 112, 216, 0.6)',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: '0.3px 0.3px darkgreen',
                boxShadow: '0 3px 5px 2px rgba(120, 120, 120, .3)'
              }}
            >😎 Stamen Feb. 2022.</Typography>
          </div>
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  );
}

export default App;
