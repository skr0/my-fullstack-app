document.addEventListener("DOMContentLoaded", function() {
    const apiURL = '/.netlify/functions/get-entries';
    const tableBody = document.getElementById('data-table-body');
    const loader = document.getElementById('loader');

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            if (data && data.length > 0) {
                data.forEach(entry => {
                    const tableRow = document.createElement('tr');
                    const submissionDate = new Date(entry.createdAt).toLocaleString('ar-SA');
                    
                    let prayerListHTML = '<ul>';
                    if(entry.mosques && entry.dates && entry.mosques.length === entry.dates.length) {
                        for(let i = 0; i < entry.mosques.length; i++) {
                            const prayerDate = new Date(entry.dates[i]).toLocaleDateString('ar-SA');
                            prayerListHTML += `<li><strong>${entry.mosques[i]}</strong> - بتاريخ: ${prayerDate}</li>`;
                        }
                    }
                    prayerListHTML += '</ul>';

                    tableRow.innerHTML = `
                        <td>${submissionDate}</td>
                        <td>${entry.preacher}</td>
                        <td>${entry.month}</td>
                        <td>${entry.year}</td>
                        <td>${prayerListHTML}</td>
                    `;
                    tableBody.appendChild(tableRow);
                });
            } else {
                loader.textContent = 'لا توجد بيانات لعرضها حالياً.';
                loader.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loader.textContent = 'حدث خطأ أثناء تحميل البيانات.';
            loader.style.color = 'red';
        });
});