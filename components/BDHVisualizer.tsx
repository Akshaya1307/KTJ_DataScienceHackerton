
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ReasoningState } from '../types';

interface Props {
  states: ReasoningState[];
}

const BDHVisualizer: React.FC<Props> = ({ states }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || states.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Create a graph-like visualization of "Causal Neurons"
    const nodes = states.flatMap((s, idx) => 
      s.activeNeurons.map(n => ({ id: `${n}-${idx}`, group: idx, label: n, val: s.beliefStrength }))
    );

    const links: any[] = [];
    for (let i = 0; i < states.length - 1; i++) {
      states[i].activeNeurons.forEach(n1 => {
        states[i+1].activeNeurons.forEach(n2 => {
          links.push({ source: `${n1}-${i}`, target: `${n2}-${i+1}` });
        });
      });
    }

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", (d: any) => d3.interpolateRdYlGn(d.val))
      .call(d3.drag<SVGCircleElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("title").text(d => (d as any).label);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [states]);

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <h3 className="text-sm font-semibold uppercase text-slate-400 mb-4 flex items-center">
        <i className="fas fa-project-diagram mr-2 text-blue-400"></i>
        BDH Causal Neuron Activity (Simulation)
      </h3>
      <svg ref={svgRef} className="w-full h-[300px]"></svg>
      <div className="flex justify-between mt-2 text-[10px] text-slate-500">
        <span>Contradiction (Red)</span>
        <span>Belief State Progression</span>
        <span>Consistency (Green)</span>
      </div>
    </div>
  );
};

export default BDHVisualizer;
