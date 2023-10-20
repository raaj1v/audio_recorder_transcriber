document.addEventListener('DOMContentLoaded', () => {
    const startRecordingButton = document.getElementById('startRecording');
    const stopRecordingButton = document.getElementById('stopRecording');
    const audioPlayer = document.getElementById('audioPlayer');
    const transcription = document.getElementById('transcription');

    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    // Check if the browser supports the necessary APIs
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio recording.');
    } else {
        startRecordingButton.addEventListener('click', startRecording);
        stopRecordingButton.addEventListener('click', stopRecording);
    }

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioPlayer.src = URL.createObjectURL(audioBlob);
            };

            mediaRecorder.start();
            isRecording = true;

            startRecordingButton.disabled = true;
            stopRecordingButton.disabled = false;
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }

    function stopRecording() {
        if (isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            startRecordingButton.disabled = false;
            stopRecordingButton.disabled = true;
        }
    }
});
