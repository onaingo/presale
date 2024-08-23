import styled from 'styled-components';

const ProgressBar = ({ progress }) => {
    return (
        <ProgressContainer>
            <ProgressWave progress={progress} />
        </ProgressContainer>
    );
};

const ProgressContainer = styled.div`
    width: 100%;
    background-color: #f1f1f1;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    height: 20px;
`;

const ProgressWave = styled.div`
    width: ${(props) => props.progress}%;
    background: linear-gradient(270deg, #007bff, #0056b3);
    height: 100%;
    background-size: 400% 400%;
    animation: wave 1.5s ease-in-out infinite;
    
    @keyframes wave {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;

export default ProgressBar;
