const getCrafts = async () => {
  try {
    return (await fetch("api/crafts/")).json();
  } catch (error) {
    console.log(error);
  }
};

const showCrafts = async () => {
  const crafts = await getCrafts();
  console.log(crafts);
  const craftList = document.getElementById("craft-list");
  craftList.innerHTML = "";

  const numCrafts = crafts.length;
  const numColumns = 4;
  const numPerColumn = Math.ceil(numCrafts / numColumns);

  for (let i = 0; i < numColumns; i++) {
    const craftImagesContainer = document.createElement("div");
    craftImagesContainer.classList.add("column");

    for (
      let j = i * numPerColumn;
      j < Math.min((i + 1) * numPerColumn, numCrafts);
      j++
    ) {
      const craft = crafts[j]; // Get the craft for this iteration
      const imgSect = document.createElement("section");
      imgSect.classList.add("craft");
      craftImagesContainer.append(imgSect);

      // Making the whole section clickable
      const a = document.createElement("a");
      a.href = "#";
      imgSect.append(a);

      const img = document.createElement("img");
      img.src = "images/" + craft.image;
      img.style.width = "90%";
      img.style.height = "auto";
      a.append(img);

      a.onclick = (e) => {
        e.preventDefault();
        displayDetails(craft);
      };
    }

    craftList.append(craftImagesContainer);
  }
};

const displayDetails = (craft) => {
  openDialog("craft-details");

  const craftDetails = document.getElementById("craft-details");
  craftDetails.innerHTML = "";

  const image = document.createElement("img");
  image.src = "images/" + craft.image;
  image.style.maxWidth = "50%";
  image.style.height = "auto";
  craftDetails.append(image);

  const h3 = document.createElement("h3");
  h3.innerHTML = craft.name;
  craftDetails.append(h3);

  const p = document.createElement("p");
  p.innerHTML = craft.description;
  craftDetails.append(p);

  const ul = document.createElement("ul");
  craftDetails.append(ul);

  craft.supplies.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = item;
    ul.append(li);
  });
};

const addCraft = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-craft-form");
  const formData = new FormData(form);
  let response;
  formData.append("supplies", getSupplies());
  console.log(...formData);

  response = await fetch("api/crafts/", {
    method: "POST",
    body: formData,
  });
  console.log(response);
  //successfully got data from server
  if (response.status != 200) {
    console.log("Error posting data");
  }
  await response.json();
  resetForm();
  document.getElementById("dialog").style.display = "none";
  showCrafts();
};

const getSupplies = () => {
  const inputs = document.querySelectorAll("#supply-boxes input");
  let supplies = [];

  inputs.forEach((input) => {
    supplies.push(input.value);
  });

  return supplies;
};

const openDialog = (id) => {
  document.getElementById("dialog").style.display = "block";
  document.querySelectorAll("#dialog-details > *").forEach((item) => {
    item.classList.add("hidden");
  });
  console.log(document.getElementById(id));
  document.getElementById(id).classList.remove("hidden");
};

const showCraftForm = (e) => {
  e.preventDefault();
  openDialog("add-craft-form");
};

const resetForm = () => {
  const form = document.getElementById("add-craft-form");
  form.reset();
  document.getElementById("supply-boxes").innerHTML = "";
  document.getElementById("img-prev").src = "";
};

const addSupply = (e) => {
  e.preventDefault();
  const section = document.getElementById("supply-boxes");
  const input = document.createElement("input");
  input.type = "text";
  section.append(input);
};

showCrafts();
document.getElementById("add-link").onclick = showCraftForm;
document.getElementById("add-supplies").onclick = addSupply;
document.getElementById("add-craft-form").onsubmit = addCraft;
document.getElementById("cancel").onclick = resetForm;

document.getElementById("img").onchange = (e) => {
  if (!e.target.files.length) {
    document.getElementById("img-prev").src = "";
    return;
  }
  document.getElementById("img-prev").src = URL.createObjectURL(
    e.target.files.item(0)
  );
};
