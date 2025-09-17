import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import NewEntry from '../../app/investments/view/NewEntry';

export default function CardAlert() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
        <CardContent>
          <AutoAwesomeRoundedIcon fontSize="small" />
          <Typography gutterBottom sx={{ fontWeight: 600 }}>
            Your investment is less than everyone else
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Transfer to the company wallet and fill up details.
          </Typography>
          <Button variant="contained" size="small" fullWidth onClick={() => setOpen(true)}>
            New Entry ? Click Me
          </Button>
        </CardContent>
      </Card>
      <NewEntry open={open} onClose={() => setOpen(false)} />
    </>
  );
}
