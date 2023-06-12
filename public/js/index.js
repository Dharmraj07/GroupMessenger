// Function to handle the change event of the Action dropdown
document.getElementById("action").addEventListener("change", function () {
  var isAdminGroup = document.getElementById("adminGroup");
  var actionValue = this.value;

  if (actionValue === "add") {
    isAdminGroup.style.display = "block"; // Show the IsAdmin field
  } else {
    isAdminGroup.style.display = "none"; // Hide the IsAdmin field
  }
});

 const API_URL = "http://localhost:8000";
//const API_URL="http://13.48.46.151:8000";

const name = localStorage.getItem("username");

function showUserName() {
  const username = document.getElementById("username");
  username.innerHTML = "";
  username.innerHTML = `<i class="fas fa-heart"></i> ${name}`;
}

showUserName();

// const chatGroup = document.getElementById('chat-group');
// chatGroup.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const group = document.getElementById('group');
//   console.log(group);
// });
const chatGroup = document.getElementById("chat-group");
const groupSelect = document.getElementById("group");

chatGroup.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedGroup = groupSelect.value;
  console.log(selectedGroup);
  const redirectURL =
    `chatroom.html?group_id=` +
    encodeURIComponent(selectedGroup) +
    `&username=` +
    encodeURIComponent(name);
  window.location.href = redirectURL;
});

async function getAllGroups() {
  try {
    const response = await axios.get(`${API_URL}/usergroups`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // console.log(response)
    const allGroup = response.data;
    let str = "";
    allGroup.forEach((element) => {
      console.log(element.groupName);
      let option = document.createElement("option");
      option.value = element.group_id;
      option.text = element.groupName;

      let row = `<option value="${element.group_id}">${element.groupName}</option>`;
      str += row;
      // Append the option to the select element
      //  document.getElementById("grouplist").appendChild(option);
      document.querySelector("#group").appendChild(option);
    });
    console.log(str);
    document.getElementById("grouplist").innerHTML = str;

    //console.log(allGroup);
  } catch (error) {
    console.error(error);
  }
}
getAllGroups();

document
  .getElementById("createGroupButton")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const groupName = document.getElementById("groupName").value;

    try {
      let res = await axios.post(
        `${API_URL}/creategroup`,
        { groupName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.data);

      const group_data = res.data;
      // Create a new option element
      var option = document.createElement("option");
      option.value = group_data.id;
      option.text = group_data.groupName;
      alert("Group created successfully...");

      // Append the option to the select element
      var groupSelect = document.getElementById("group");
      groupSelect.appendChild(option);

      // Append the option to the grouplist element
      var groupList = document.getElementById("grouplist");
      groupList.appendChild(option.cloneNode(true));

      // // Append the option to the row in grouplist using innerHTML
      // var row = `<option value="${group_data.id}">${group_data.groupName}</option>`;
      // groupList.innerHTML += row;

      // Hide the modal
      $("#createGroupModal").modal("hide");
      document.getElementById("createGroupModal").style.display = "none";
    } catch (error) {
      console.error(error);
    }
  });

document.getElementById("addGroup").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const group_id = parseInt(document.getElementById("grouplist").value);
  const isAdmin = document.getElementById("admin").value;
  const action = document.getElementById("action").value;
  console.log(`Action === ${action}`);
  let routes = "removeUserFromGroup";
  if (action === "add") routes = "adduserToGroup";
  let admin = false;
  if (isAdmin === "1") admin = true;
  console.log(admin);
  console.log(email);
  console.log(group_id);
  console.log(admin);
  const user_id = parseInt(localStorage.getItem("user_id"));
  console.log(`user id == ${user_id}`);
  // console.log()

  try {
    const response = await axios.post(`${API_URL}/${routes}`, {
      email,
      user_id,
      group_id,
      admin,
    });
    console.log(email, user_id, group_id, admin);
    console.log(response.data);
    const msg = response.data.message;
    alert(msg);
  } catch (error) {
    console.error(error);
  }
});
