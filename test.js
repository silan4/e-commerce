const url = 'https://jsonplaceholder.typicode.com/users';


// fetch : api' lere istek atmamızı sağlar
 fetch(url)
 
// olumlu cevap gelirse çalışır
 .then((response)  =>{ 

// gelen json verisini js'de kullanılabilir hale getirir
return response.json();

})
//veri işlendikten sonra çalışır
.then(renderUser)

// promise yapısından olumsuz cevap gelirse çalışır

.catch((error) => {
    console.log("veri çekerken hata oluştu" + error);

});

function renderUser(data){
    data.forEach((user) => document.write(user.name + '<br>')); 
        
}
