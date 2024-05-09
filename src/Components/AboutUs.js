import React from 'react';
import { Box, Typography, Container, Grid, Paper, Avatar } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';
import StarRateIcon from '@mui/icons-material/StarRate';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroBox = styled(Box)(({ theme }) => ({
    backgroundImage: 'url("https://source.unsplash.com/random/1920x1080?electronic")',
    height: '50vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    padding: theme.spacing(4),
    backgroundColor: 'rgba(0,0,0,0.5)'
}));


  

const TeamMemberPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  textAlign: 'center'
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  margin: 'auto'
}));

const ReviewPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(2)
  }));
  
  
  function AboutUsPage() {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const reviews = [
        {
            text: "Amazing product, great service!",
            rating: 5,
            avatar: "https://i.pinimg.com/474x/2d/d8/a4/2dd8a4c97818bff3b2300da8f1b5fea7.jpg"
        },
        {
            text: "Fast delivery and fantastic quality!",
            rating: 4,
            avatar: "https://i.pinimg.com/236x/bf/57/02/bf57026ee75af2f414000cec322f7404.jpg"
        }
    ];

    return (
        <div>
            <HeroBox>
                <Typography variant="h2">About Us</Typography>
            </HeroBox>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" gutterBottom>
                 
                </Typography>
                <Typography variant="h4" align="center" gutterBottom>
                Our Mission
                </Typography>
                <Typography>
                Here, we are dedicated to revolutionizing your digital lifestyle through cutting-edge electronic products. Our mission is to harness the power of technology to simplify complex problems and enhance the efficiency and enjoyment of everyday tasks.
                </Typography>

                <Typography variant="h4" align="center" gutterBottom>
                    Our History
                </Typography>
                                <Timeline align="alternate">
                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                    <Typography>
                        <strong>2010:</strong> Our journey began with a passionate team of tech enthusiasts eager to change the world.
                    </Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                    <Typography>
                        <strong>2012:</strong> We launched our first product, which received acclaim for its innovative design and user-friendly features.
                    </Typography>
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                    <TimelineDot />
                    </TimelineSeparator>
                    <TimelineContent>
                    <Typography>
                        <strong>2015:</strong> We expanded our reach, bringing our products to international markets and gaining a loyal global customer base.
                    </Typography>
                    </TimelineContent>
                </TimelineItem>
                </Timeline>
                <Typography variant="h4" align="center" gutterBottom>
                    Meet Our Team
                </Typography>
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <TeamMemberPaper elevation={3}>
                            <LargeAvatar alt="Team Member" src="https://i.pravatar.cc/300" />
                            <Typography>Jane Doe, CEO</Typography>
                        </TeamMemberPaper>
                    </Grid>
                    {/* Additional team members */}
                </Grid>

                <Typography variant="h4" align="center" gutterBottom>
                    Our Values
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography align="center">Innovation</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography align="center">Quality</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography align="center">Customer Satisfaction</Typography>
                    </Grid>
                </Grid>

                <Typography variant="h4" align="center" gutterBottom>
                    Customer Reviews
                </Typography>
                <Slider {...settings}>
                    {reviews.map((review, index) => (
                        <ReviewPaper elevation={3} key={index}>
                            <Typography variant="subtitle1">"{review.text}"</Typography>
                            <Box>
                                {[...Array(review.rating)].map((_, i) => (
                                    <StarRateIcon key={i} style={{ color: 'gold' }} />
                                ))}
                            </Box>
                            <Avatar src={review.avatar} style={{ margin: '10px auto', width: 80, height: 80 }} />
                        </ReviewPaper>
                    ))}
                </Slider>
            </Container>
        </div>
    );
}

export default AboutUsPage;