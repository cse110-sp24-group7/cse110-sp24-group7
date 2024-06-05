console.log("all-tasks.js script loaded"); // Add this line

/**
 * Adds tasks to the task containers.
 * @param {import("../scripts/database/dbMgr").task[]} tasks - an array of task objects.
 */
function tasksRendererCallback(tasks) {
    // console.log("tasksRendererCallback called");
    // console.log(tasks);


    // // Clear all existing task entries first
    // document.querySelectorAll(".task-container").forEach((container) => {
    //   container.innerHTML = ""; // Clears all child elements
    // });
  
    // // Add new tasks
    // tasks.forEach((task) => {
    //   // Create elements for the task entry
    //   const taskPv = document.createElement("div");
    //   taskPv.classList.add("task-pv");
  
    //   const taskName = document.createElement("h2");
    //   taskName.textContent = task.task_name;
    //   taskPv.appendChild(taskName);
  
    //   const taskContent = document.createElement("p");
    //   taskContent.textContent = task.task_content;
    //   taskPv.appendChild(taskContent);
  
    //   const taskDueDate = document.createElement("p");
    //   taskDueDate.textContent = `Due: ${task.due_date}`;
    //   taskPv.appendChild(taskDueDate);
  
    //   const taskPriority = document.createElement("p");
    //   taskPriority.textContent = `Priority: ${task.priority}`;
    //   taskPv.appendChild(taskPriority);
  
    //   const taskExpectedTime = document.createElement("p");
    //   taskExpectedTime.textContent = `Expected Time: ${task.expected_time}`;
    //   taskPv.appendChild(taskExpectedTime);
  
    //   // Find the appropriate day container based on the task's due date
    //   // Assuming due_date is in 'YYYY-MM-DD' format and you need to map it to a specific day
    //   const creationDate = new Date(task.creation_date);
    //   const dueDate = new Date(task.due_date);
    //   const dayIndex = dueDate.getDay(); // Sunday - Saturday : 0 - 6
    //   const dayContainers = document.querySelectorAll('.calendar .day');
    //   const dayContainer = dayContainers[dayIndex];
    //   const msDay = 60*60*24*1000;
  
      // if (dayContainer) {
      //   const taskContainer = dayContainer.querySelector('.task-container');
      //   const daysLeftContainer = dayContainer.querySelector('.time-left-container .days-left');
      //   taskContainer.appendChild(taskPv);   

    //     // TODO: Calculate number of squares to shade and populate the squares into the view
    //     const totalDays = (dueDate - creationDate) / msDay;      // gives total number of days task can be done within
    //     const daysLeft = (dueDate - creationDate) / msDay;      // days left
    //     const daysPast = totalDays - daysLeft;
    //     const graySquares = Math.round((daysPast / totalDays) * 10); // # of gray squares for days past
    //     const greenSquares = 10 - graySquares; // # of gray squares for days past
        
    //     console.log("calculations completed with " + graySquares + " " + greenSquares);

    //     // Populate the gray squares
    //     for (let i = 0; i < graySquares; i++) {
    //         const square = document.createElement('div');
    //         square.classList.add('day-left-square');
    //         square.style.backgroundColor = '#bdbdbd';
    //         daysLeftContainer.appendChild(square);
    //     }
        
    //     // Populate the green squares
    //     for (let i = 0; i < greenSquares; i++) {
    //         const square = document.createElement('div');
    //         square.classList.add('day-left-square');
    //         square.style.backgroundColor = '#4caf50';
    //         daysLeftContainer.appendChild(square);
    //     }

    //     // Display amount of time left
    //     // Update days left text
    //     const daysLeftTextContainer = dayContainer.querySelector('.days-left-text');
    //     daysLeftTextContainer.querySelector('h3').textContent = `${Math.ceil(daysLeft)} days left`;
    //   } else {
    //     console.warn("No day container found for day index:", dayIndex); // Debugging log
    //   }
    // });
}

/**
 * Generates the dates to show for each row of visible tasks
 * @param {Array} tasks - an array of task objects.
 */
function displayTasks(tasks) {
  const calendar = document.querySelector('.calendar');
  const dayTemplates = document.querySelectorAll('.day');
  
  let currentMonth = '';
  tasks.forEach(task => {
      const dueDate = new Date(task.due_date);
      const month = dueDate.toLocaleString('en-US', { month: 'long' });
      
      //Displays month divider
      if (month !== currentMonth) {
          const monthDivider = document.createElement('div');
          monthDivider.classList.add('month-divider');
          monthDivider.textContent = month;
          calendar.appendChild(monthDivider);
          currentMonth = month;
      }

    
    const dayOfWeek = dueDate.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3);
    const dayTemplate = Array.from(dayTemplates).find(template => template.id === dayOfWeek);
    let currentDate = dueDate;

    // Iterates through each task (Due-Date) in array
    if (dayTemplate) {
        // Using HTML as templates, avoiding dupes and blocking empty 7 rows
        const dayDiv = dayTemplate.cloneNode(true);
        dayDiv.removeAttribute('id');
        dayDiv.style.display = 'block';

        // Displays correct date
        const dateDiv = dayDiv.querySelector('.day-date');
        dateDiv.textContent = `${currentDate.getDate()}`;

        //TODO: FILL TASKS CONTAINER
        const taskDiv = dayDiv.querySelector('.task-container');
        taskDiv.innerHTML = `TASK GOES HERE`;

        calendar.appendChild(dayDiv);
    }
  });
}


  document.addEventListener("DOMContentLoaded", function () {
    // document.addEventListener("storageUpdate", () => {
    //   let storedEntries = JSON.parse(localStorage.getItem("journalData"));
    //   storedEntries = Array.isArray(storedEntries) ? storedEntries : [];
    //   let storedTasks = JSON.parse(localStorage.getItem("tasks"));
    //   storedTasks = Array.isArray(storedTasks) ? storedTasks : [];
    //   tasksRendererCallback(storedTasks);
    //   entriesRendererCallback(storedEntries);
    // });
  
    /*
    window.api.getTasks((tasks) => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      tasksRendererCallback(tasks);
    });
    */
  
    // // creates the popup when the add task button is clicked
    // document.querySelectorAll(".add-task").forEach((button) => {
    //   button.addEventListener("click", function () {
    //     const popup = document.createElement("task-popup");
    //     document.body.appendChild(popup);
    //   });
    // });

    // tasksRendererCallback([testTask]);
    const testTasks = [
      {
          task_name: "Task 1 05-15",
          task_content: "This is the first task",
          due_date: "2024-06-01",
          creation_date: "2024-05-15",
          priority: "P1",
          expected_time: "2 hours"
      },
      {
          task_name: "Task 2 06-05",
          task_content: "This is the second task",
          due_date: "2024-06-05",
          creation_date: "2024-05-30",
          priority: "P2",
          expected_time: "1 hour"
      },
      {
          task_name: "Task 3 06-10",
          task_content: "This is the third task",
          due_date: "2024-06-10",
          creation_date: "2024-06-01",
          priority: "P1",
          expected_time: "3 hours"
      },
      {
          task_name: "Task 4 06-15",
          task_content: "This is the fourth task",
          due_date: "2024-06-15",
          creation_date: "2024-06-05",
          priority: "P3",
          expected_time: "2 hours"
      },
      {
          task_name: "Task 5 06-20",
          task_content: "This is the fifth task",
          due_date: "2024-06-20",
          creation_date: "2024-06-10",
          priority: "P2",
          expected_time: "1.5 hours"
      },
      {
          task_name: "Task 6 06-25",
          task_content: "This is the sixth task",
          due_date: "2024-06-25",
          creation_date: "2024-06-15",
          priority: "P1",
          expected_time: "2 hours"
      },
      {
          task_name: "Task 7 07-10",
          task_content: "This is the seventh task",
          due_date: "2024-07-01",
          creation_date: "2024-07-10",
          priority: "P3",
          expected_time: "1 hour"
      }
  ];
  
    displayTasks(testTasks);


  });