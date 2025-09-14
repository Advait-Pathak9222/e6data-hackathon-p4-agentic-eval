// src/App.js
import React, { useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import "./App.css";

function App() {
  const [agents, setAgents] = useState([
    { id: "Agent-1", prompt: "", response: "", metadata: "" },
    { id: "Agent-2", prompt: "", response: "", metadata: "" }
  ]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const copy = [...agents];
    copy[index][field] = value;
    setAgents(copy);
  };

  const addAgent = () => {
    setAgents([...agents, { id: `Agent-${agents.length + 1}`, prompt: "", response: "", metadata: "" }]);
  };

  const removeAgent = (index) => {
    const copy = [...agents];
    copy.splice(index, 1);
    setAgents(copy);
  };

  const handleEvaluate = async () => {
    setLoading(true);
    const newResults = {};
    try {
      // Run evaluations in parallel for responsiveness
      const promises = agents.map(agent =>
        axios.post("http://localhost:8000/evaluate", {
          prompt: agent.prompt,
          response: agent.response,
          metadata: (() => {
            // try to parse metadata as JSON if user typed JSON; otherwise send as string
            try { return JSON.parse(agent.metadata); } catch { return agent.metadata; }
          })()
        }).then(r => ({ id: agent.id, data: r.data })).catch(e => ({ id: agent.id, error: e.response ? e.response.data : e.toString() }))
      );
      const responses = await Promise.all(promises);
      responses.forEach(r => {
        newResults[r.id] = r.error ? { error: r.error } : r.data;
      });
      setResults(newResults);
    } catch (err) {
      alert("Unexpected error: " + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Agentic Evaluation Framework</h1>

      <div className="agents">
        {agents.map((agent, i) => (
          <div className="agent-card" key={agent.id}>
            <div className="agent-header">
              <strong>{agent.id}</strong>
              <button className="small" onClick={() => removeAgent(i)}>Remove</button>
            </div>

            <label>Prompt</label>
            <textarea value={agent.prompt} onChange={e => handleChange(i, "prompt", e.target.value)} />

            <label>Response</label>
            <textarea value={agent.response} onChange={e => handleChange(i, "response", e.target.value)} />

            <label>Metadata (JSON or plain text)</label>
            <textarea value={agent.metadata} onChange={e => handleChange(i, "metadata", e.target.value)} />
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={addAgent}>Add Agent</button>
        <button onClick={handleEvaluate} disabled={loading}>{loading ? "Evaluating..." : "Evaluate All"}</button>
      </div>

      <div className="results">
        {Object.keys(results).length > 0 && <h2>Evaluation Results</h2>}

        {Object.entries(results).map(([agentId, payload]) => (
          <div className="result-card" key={agentId}>
            <h3>{agentId}</h3>

            {payload.error && <div className="error">Error: {JSON.stringify(payload.error)}</div>}

            {payload.scores && (
              <>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(payload.scores).map(([k, v]) => ({ name: k, score: v }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#6b46c1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="details">
                  <h4>Explainability (per-dimension)</h4>
                  {payload.details && Object.entries(payload.details).map(([k, v]) => (
                    <div key={k} className="detail-item">
                      <strong>{k}</strong> — score: {v.score}/10<br />
                      <em>{v.justification}</em>
                    </div>
                  ))}
                </div>

                <div className="raw-explanation">
                  <h4>Combined explanation</h4>
                  <pre>{payload.explanation}</pre>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
