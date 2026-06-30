fetch("prompts.json")
.then(response=>response.json())
.then(data=>{

const grid=document.getElementById("grid");

function render(items){

grid.innerHTML="";

items.forEach(item=>{

grid.innerHTML+=`
<div class="card">

<h2>${item.title}</h2>

<p>${item.prompt}</p>

<button onclick="copyPrompt(\`${item.prompt}\`)">
Copy Prompt
</button>

</div>
`;

});

}

render(data);

document.getElementById("search").addEventListener("input",(e)=>{

const value=e.target.value.toLowerCase();

render(

data.filter(prompt=>

prompt.title.toLowerCase().includes(value) ||

prompt.prompt.toLowerCase().includes(value)

)

);

});

});

function copyPrompt(text){

navigator.clipboard.writeText(text);

alert("Prompt Copied!");

}
