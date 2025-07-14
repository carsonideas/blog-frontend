import { Box, Paper } from '@mui/material';
import { markdownToHtml } from '../utils/markdown';
import { useEffect, useState } from 'react';

interface BlogContentProps {
  content: string;
}

export const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const html = markdownToHtml(content);
    setHtmlContent(html);
  }, [content]);

  return (
    <Paper 
      elevation={0} 
      sx={{
        padding: 3,
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          margin: '1rem auto'
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          marginTop: '1.5rem',
          marginBottom: '1rem',
          fontWeight: 600,
          lineHeight: 1.25
        },
        '& p': {
          marginBottom: '1rem',
          lineHeight: 1.7
        },
        '& ul, & ol': {
          marginBottom: '1rem',
          paddingLeft: '2rem'
        },
        '& li': {
          marginBottom: '0.5rem'
        },
        '& blockquote': {
          borderLeft: '4px solid #e0e0e0',
          paddingLeft: '1rem',
          fontStyle: 'italic',
          margin: '1rem 0'
        },
        '& code': {
          backgroundColor: '#f5f5f5',
          padding: '0.2rem 0.4rem',
          borderRadius: '4px',
          fontSize: '0.875em'
        },
        '& pre': {
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
          marginBottom: '1rem',
          '& code': {
            backgroundColor: 'transparent',
            padding: 0
          }
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        },
        '& hr': {
          border: 'none',
          borderTop: '1px solid #e0e0e0',
          margin: '2rem 0'
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '1rem',
          '& th, & td': {
            border: '1px solid #e0e0e0',
            padding: '0.5rem'
          },
          '& th': {
            backgroundColor: '#f5f5f5',
            fontWeight: 600
          }
        }
      }}
    >
      <Box 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
        sx={{ 
          '& > *:first-of-type': { marginTop: 0 },
          '& > *:last-child': { marginBottom: 0 }
        }} 
      />
    </Paper>
  );
};