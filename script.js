const defaultTodo = [
    { done: true, name: "Tache 1" },
    { done: true, name: "Tache 2" },
  ];
  
  const btn = document.querySelector("#add");
  const container = document.querySelector("#container-list");
  const input = document.querySelector("#new");
  console.log(btn);
 


  const displayTodos = (listTodo) => {
    
      
  
      container.innerHTML = "";
      defaultTodo.forEach((contenu) => {
        console.log(contenu);
        console.log(input.value);
  
        container.innerHTML += `
          <div class="flex justify-center">
            <div class="flex justify-center gap-8 bg-[#162A43] rounded-xl my-4">
              <div class="px-4 py-2 bg-green-600 rounded-xl m-2">${contenu.done}</div>
              <div class="px-4 py-2 bg-green-600 rounded-xl m-2">${contenu.name}</div>
              <div class="px-4 py-2 bg-green-600 rounded-xl m-2">Supp</div>
            </div>
          </div>
        `;
      });
  };
  
  displayTodos(defaultTodo);

btn.addEventListener('click',()=>{
    const nouvelleTache = { done: false, name: input.value };
    input.value="";
    defaultTodo.push(nouvelleTache);
    displayTodos(defaultTodo);
});
