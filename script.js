document.getElementById("startSearch").addEventListener("click", function () {
    const arrayInput = document.getElementById("array").value.trim();
    const target = parseInt(document.getElementById("target").value.trim());
    const array = arrayInput.split(",").map((num) => parseInt(num.trim())).sort((a, b) => a - b);

    const stepsDiv = document.getElementById("steps");
    const arrayContainer = document.getElementById("arrayContainer");
    const binaryTreeDiv = document.getElementById("binaryTree");

    // Clear previous results
    stepsDiv.innerHTML = "";
    arrayContainer.innerHTML = "";
    binaryTreeDiv.innerHTML = "";

    if (!array.length || isNaN(target)) {
        stepsDiv.innerHTML = "<p>Please enter a valid array and target number!</p>";
        return;
    }

    // Render the array for binary search visualization
    array.forEach((num, index) => {
        const div = document.createElement("div");
        div.className = "array-element";
        div.id = `element-${index}`;
        div.innerText = num;
        arrayContainer.appendChild(div);
    });

    // Perform binary search
    let low = 0, high = array.length - 1, step = 0;

    while (low <= high) {
        step++;
        const mid = Math.floor((low + high) / 2);
        const currentStep = document.createElement("p");
        currentStep.innerText = `Step ${step}: Checking middle element at index ${mid} (value: ${array[mid]})`;

        stepsDiv.appendChild(currentStep);

        // Highlight current element
        document.getElementById(`element-${mid}`).classList.add("highlight");

        if (array[mid] === target) {
            currentStep.innerText += " - Target Found!";
            break;
        } else if (array[mid] < target) {
            currentStep.innerText += " - Target is larger, searching right.";
            low = mid + 1;
        } else {
            currentStep.innerText += " - Target is smaller, searching left.";
            high = mid - 1;
        }
    }

    if (low > high) {
        const notFound = document.createElement("p");
        notFound.innerText = "Target not found in the array.";
        stepsDiv.appendChild(notFound);
    }

    // Binary Tree Visualization
    visualizeBinaryTree(array, binaryTreeDiv);
});

function visualizeBinaryTree(array, container) {
    if (!array.length) return;

    const createNode = (value) => {
        const node = document.createElement("div");
        node.className = "tree-node";
        node.innerText = value;
        return node;
    };

    const createLine = (x1, y1, x2, y2) => {
        const line = document.createElement("div");
        line.className = "tree-line";
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.top = `${y1}px`;
        line.style.left = `${x1}px`;
        return line;
    };

    const drawTree = (array, parent, level = 0, leftOffset = 400) => {
        if (!array.length) return;

        const midIndex = Math.floor(array.length / 2);
        const rootNode = createNode(array[midIndex]);

        const xPosition = leftOffset;
        const yPosition = level * 100;

        rootNode.style.left = `${xPosition}px`;
        rootNode.style.top = `${yPosition}px`;
        container.appendChild(rootNode);

        // Draw left subtree
        const leftArray = array.slice(0, midIndex);
        if (leftArray.length > 0) {
            const leftChildX = xPosition - 200 / (level + 1);
            const leftChildY = yPosition + 100;

            const line = createLine(
                xPosition + 25,
                yPosition + 50,
                leftChildX + 25,
                leftChildY
            );
            container.appendChild(line);

            drawTree(leftArray, rootNode, level + 1, leftChildX);
        }

        // Draw right subtree
        const rightArray = array.slice(midIndex + 1);
        if (rightArray.length > 0) {
            const rightChildX = xPosition + 200 / (level + 1);
            const rightChildY = yPosition + 100;

            const line = createLine(
                xPosition + 25,
                yPosition + 50,
                rightChildX + 25,
                rightChildY
            );
            container.appendChild(line);

            drawTree(rightArray, rootNode, level + 1, rightChildX);
        }
    };

    drawTree(array, null, 0, 400); // Start tree rendering from the center
}
