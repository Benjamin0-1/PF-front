import React from 'react';
import { Container, Typography, Box, Link, List, ListItem, Divider } from '@mui/material';

const CV = () => {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={4}>
        <Typography variant="h2">Benjamin Diaz</Typography>
        <Typography variant="h5">Full Stack Developer</Typography>
        <Typography>Chile, Santiago | Phone | oliver125125@protonmail.com</Typography>
        <Typography>
          <Link href="https://www.linkedin.com">LinkedIn</Link> - <Link href="https://www.github.com">GitHub</Link>
        </Typography>
      </Box>
      
      <Section title="Summary">
        <Typography paragraph>
          Full Stack Developer with a background in [insert background]. Specialized in Back-end development. Knowledgeable in GIT, data structures, algorithms, relational databases like MySQL, Node.js with Express.js, Python, and intermediate-level React.js. Possesses problem-solving, communication, and adaptability skills. English Level: Advanced.
        </Typography>
      </Section>

      <Section title="Projects">
        <Typography variant="h6">Full Stack Web Developer - PF-back</Typography>
        <Typography paragraph>Apr. 2022 - May. 2022 | Academic Experience, Henry Bootcamp</Typography>
        <List>
          <ListItem>Developed a backend for user authentication and authorization.</ListItem>
          <ListItem>Implemented product management functionalities.</ListItem>
          <ListItem>Managed order processing and user profile updates.</ListItem>
          <ListItem>Integrated password recovery and two-factor authentication.</ListItem>
          <ListItem>Added Google authentication for user convenience.</ListItem>
        </List>
        <Typography paragraph>
          <strong>Technologies:</strong> Front: JavaScript | Back: Node.js, Express.js | Database: PostgreSQL and Sequelize
        </Typography>
        <Typography>
          <Link href="https://github.com/Benjamin0-1/PF-back">GitHub Repository</Link>
        </Typography>
      </Section>

      <Section title="Professional Experience">
        <Experience
          title="Full Stack Developer Junior"
          company="[Company Name]"
          period="Aug. 2021 - Present"
          tasks={[
            'Developed landing pages, dashboards, and online applications using [technologies].',
            'Designed and optimized frontend interfaces, maintained web interfaces.',
            'Increased web traffic by 20% through improved site navigation in Q1 2022.'
          ]}
        />
        <Experience
          title="Full Stack Teaching Assistant"
          company="Academic Experience, Henry Bootcamp"
          period="Sep. 2022 - Nov. 2022"
          tasks={[
            'Coordinated a group of students to integrate into the study team.',
            'Assisted in exercise resolution and promoted group collaboration (Pair Programming).',
            'Proposed ideas to improve Bootcamp processes.'
          ]}
        />
        <Experience
          title="Software Engineer"
          company="[Company Name]"
          period="Sep. 2018 - Nov. 2019"
          tasks={[
            'Developed systems and tools focusing on performance and scalability.',
            'Maintained databases, functional and technical documents.',
            'Increased company revenue by 35% by creating an e-commerce platform for custom t-shirt design and purchase in Q1 2019.'
          ]}
        />
      </Section>

      <Section title="Technologies">
        <List>
          <ListItem>Programming Languages: JavaScript, Python</ListItem>
          <ListItem>Frameworks: Node.js, Express.js, React.js</ListItem>
          <ListItem>Databases: MySQL, PostgreSQL, Sequelize</ListItem>
          <ListItem>Tools: Git, Jira, Confluence, Slack</ListItem>
        </List>
      </Section>

      <Section title="Education">
        <Typography paragraph>
          Full Stack Web Developer | Henry Bootcamp, 800 hours of theoretical-practical coursework, 2020
        </Typography>
        <Typography paragraph>
          Bachelor of Engineering in Systems | Universidad Mayor de San Marcos, 2010 - 2015
        </Typography>
        <Typography paragraph>
          Third Year in Computer Science | Universidad Alas del Sur, 2009
        </Typography>
      </Section>

      <Section title="Additional Education">
        <Typography paragraph>
          Introduction to Machine Learning | Udemy, 2021
        </Typography>
        <Typography paragraph>
          Problem Solving Using Computational Thinking | Udemy, 2020
        </Typography>
        <Typography paragraph>
          JavaScript School | Platzi, 2019
        </Typography>
      </Section>

      <Section title="Languages">
        <Typography paragraph>English | Advanced</Typography>
      </Section>
    </Container>
  );
};

const Section = ({ title, children }) => (
  <Box my={4}>
    <Typography variant="h4" gutterBottom>{title}</Typography>
    <Divider />
    {children}
  </Box>
);

const Experience = ({ title, company, period, tasks }) => (
  <Box mb={3}>
    <Typography variant="h6">{title}</Typography>
    <Typography>{company}</Typography>
    <Typography>{period}</Typography>
    <List>
      {tasks.map((task, index) => (
        <ListItem key={index}>{task}</ListItem>
      ))}
    </List>
  </Box>
);

export default CV;
