
async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/advice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                business: "Cleaning company",
                problem: "Too many WhatsApp messages",
                goal: "Automate customer intake"
            })
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
