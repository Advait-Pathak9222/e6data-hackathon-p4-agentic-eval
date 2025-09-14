Agentic Evaluation Framework
A Project for the e6data x IIT BHU Hackathon 2025 by The Pareto Crew
1. The Problem: The Scaling Challenge of AI Evaluation
As AI agents become more powerful and widespread, evaluating their performance is a critical bottleneck. Manual evaluation is slow, expensive, subjective, and impossible to scale. When a company has hundreds of agents producing thousands of responses, how can they efficiently ensure that the agents:

Follow instructions precisely?

Avoid factual hallucinations?

Provide coherent and useful responses?

Do not make unwarranted assumptions?

Without an automated and robust solution, building trustworthy AI is not feasible.

2. Our Solution: An Automated Evaluation & Comparison Platform
We have developed the Agentic Evaluation Framework, an interactive platform designed to solve the problem of large-scale agent evaluation. Our framework provides developers and researchers with the tools to automatically score agent responses, compare different models head-to-head, and track performance over time.

Our solution directly addresses the hackathon challenge by accepting prompts, responses, and metadata to output an interpretable performance report.

3. Key Features
Our framework is built as an interactive Google Colab notebook and includes:

Batch Processing Engine: A core script that processes thousands of responses from a CSV file, scoring each one across the four key dimensions: instruction-following, coherence, assumption control, and hallucination detection.

Live "Head-to-Head" Demo: A user-friendly interface where a user can input a single prompt and have two different AI models generate responses in real-time. Both responses are then instantly evaluated and displayed side-by-side for direct comparison.

Performance Dashboard: A visualization tab that displays a ranked leaderboard of all evaluated agents, providing a clear overview of which models are performing best on average.

Metadata Integration: The evaluation process accepts metadata, allowing for more context-aware and nuanced judgments of an agent's response.

4. Technical Methodology
Our project was built with a focus on innovation, speed, and technical depth.

Core Technology: Python, running in a Google Colab environment with a T4 GPU.

Local LLMs with Ollama: To ensure zero cost and high flexibility, we use Ollama to run powerful open-source models like llama3:8b and phi3:mini locally. This demonstrates the ability to build powerful AI systems without relying on expensive, proprietary APIs.

Asynchronous Processing for Speed: In our Head-to-Head demo, all four LLM calls (two for generation, two for evaluation) are executed in parallel using Python's asyncio library. This significantly reduces the waiting time and creates a smooth user experience, showcasing a deep understanding of performance optimization.

Rich Interactive UI: The user interface is built using ipywidgets, creating a responsive and intuitive application directly within the Colab notebook.

5. Setup and Usage Instructions
To run our project, please follow these steps in a Google Colab environment:

Open the File: Open the provided Agentic_AI.py file in Google Colab i.e. copy paste the code given in the file inside a single cell in google collab.

Set the Runtime: In the menu, go to Runtime -> Change runtime type and select T4 GPU.

Run Cell 1 (Setup): Execute the first cell to install Ollama, download the necessary AI models, and install the required Python libraries. This will take a few minutes.

Upload Data: Use the file browser on the left to upload the final_report_with_scores.csv file. This is needed for the Performance Dashboard.

Run Cell 2 (Application): Execute the second cell. The interactive, tabbed interface for the "Head-to-Head Demo" and "Performance Dashboard" will appear as the output. You can now use the application.

Thank you for evaluating our project!