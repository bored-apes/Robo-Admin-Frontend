'use client';

import React from 'react';
import { Card, CardContent, CardHeader, Typography, SvgIconProps } from '@mui/material';

interface FormCardProps {
  title: string;
  icon?: React.ComponentType<SvgIconProps>;
  children: React.ReactNode;
  maxWidth?: string | number;
  elevation?: number;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  icon: Icon,
  children,
  maxWidth,
  elevation = 0,
}) => {
  return (
    <Card
      variant="outlined"
      elevation={elevation}
      sx={{
        maxWidth: maxWidth || '100%',
        height: 'fit-content',
      }}
    >
      <CardHeader
        avatar={Icon ? <Icon color="primary" /> : undefined}
        title={
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>{children}</CardContent>
    </Card>
  );
};

export default FormCard;
