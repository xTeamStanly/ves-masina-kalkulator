import { ListItem, Typography } from '@mui/material';

const daLiJeDatum = (datum) => { return Object.prototype.toString.call(datum) === '[object Date]' }

const formatirajDatum = (datum) => {
    let sati = datum.getHours().toString();
    if(sati.length < 2) { sati = `0${sati}`; }

    let minuti = datum.getMinutes().toString();
    if(minuti.length < 2) { minuti = `0${minuti}`; }

    return `${sati}:${minuti}`;
}

const returnListItem = (ime, vrednost, important, color) => {
    if(color) {
        return (
            <ListItem key={ime}>
                <Typography fontWeight={'bold'} >{ime}:&nbsp;</Typography>
                <Typography style={{color: color, fontWeight: 'bold'}}>{vrednost}</Typography>
            </ListItem>
        );
    }

    if(important && !color) {
        return (
            <ListItem key={ime}>
                <Typography fontWeight={'bold'} >{ime}:&nbsp;</Typography>
                <Typography style={{color: 'red', fontWeight: 'bold'}}>{vrednost}</Typography>
            </ListItem>
        );
    }

    return (
        <ListItem key={ime}>
            <Typography fontWeight={'bold'} >{ime}:&nbsp;</Typography>
            <Typography>{vrednost}</Typography>
        </ListItem>
    );
}

export { daLiJeDatum, formatirajDatum, returnListItem };