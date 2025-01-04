function determineOffers () {

    // returning a resolved promise - IP ADDRESS AND PORT NUMBER!
    return new Promise((resolve, reject) => {

        let hasResolved = false;

        //creating a RTC connection to ping the STUN Server
        const pc = new RTCPeerConnection({
            iceServers: [{
                urls: 'stun:stun.l.google.com:19302'    //publicly accessible google's STUN Server address
            }]
        });
        
        //This is triggered when STUN server responds with ICE Candidate
        pc.onicecandidate = (ice) => {
            if (ice.candidate) {
                const candidate = ice.candidate.candidate;
                if(candidate.includes('typ srflx')){
                    console.log(candidate);
                    //Extracting the IP Address and Port Number:
                    const match = candidate.match(/(\d{1,3}\.){3}\d{1,3}:\d+/);
                    if (match && !hasResolved ) {
                        hasResolved = true;
                        resolve(`Public IP and Port: ${match[0]}`);
                        pc.close();
                    }
                }
            } else {
                if (!hasResolved) {
                  reject('No valid ICE candidates gathered.');
                }
              }
        };

        // Only reject if we haven't already resolved with a valid candidate
        pc.onicecandidateerror = (event) => {
            if (!hasResolved) {
              reject('Failed to gather ICE candidates from the STUN server.');
            }
        };

        //Creating a data channel to initiate the ICE Candidate gathering process:
        pc.createDataChannel('ping');
        pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .catch((error) => reject(`Offer Error: ${error}`));
  });
}

export default determineOffers;
