# Firebase Init Automation Script
# This script automates the firebase init process with predefined answers

$answers = @"
Y

 
 

Y
clipvaultapi
Y
europe-west1
N
"@

$answers | npx firebase-tools init
