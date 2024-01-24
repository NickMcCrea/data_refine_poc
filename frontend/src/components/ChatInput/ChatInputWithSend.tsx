import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import styles from './ChatInput.module.css';

interface Props {
  onSubmit: (value: string) => void;
}

const InputWithSendButton: React.FC<Props> = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <div className={styles.container}>
      <TextField
        fullWidth
        multiline
        variant="outlined"
        value={value}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        onChange={(e) => setValue(e.target.value)}
      />
      <IconButton color="primary" onClick={handleSubmit} className={styles.sendButton}>
        <SendIcon />
      </IconButton>
    </div>
  );
};

export default InputWithSendButton;
