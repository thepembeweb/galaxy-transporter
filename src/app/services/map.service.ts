import { Injectable } from '@angular/core';
import * as d3 from 'd3v4';
import { Graph, Link, Node, Planet, Route } from '../models';

@Injectable({ providedIn: 'root' })
export class MapService {
  private planets: Planet[];
  private routes: Route[];

  constructor() {}

  public initialize(planets: Planet[], routes: Route[]) {
    this.planets = planets;
    this.routes = routes;
  }

  private clearGraph() {
    const svg = d3.select('svg');
    svg.selectAll('*').remove();
  }

  public loadGraph(hasShortestRoute, sourceValue, targetValue) {
    this.clearGraph();

    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const containerWidth = document.getElementsByClassName('wrapper')[0]
      .clientWidth;
    const minWidthQuery = window.matchMedia('(min-width: 500px)');
    const heightRatio = 0.8;
    const mobileDeviceViewRatio = minWidthQuery.matches ? 0.49 : 1.825;
    const width = +containerWidth * heightRatio;
    const height = +width * mobileDeviceViewRatio;
    let node, link, edgepaths, edgelabels;

    const svg = d3.select('svg');

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    const simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .id(function(d) {
            return d.id;
          })
          .distance(function(d) {
            return d.value;
          })
          .strength(0.1)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const planetNodes = this.planets.map(planet => {
      return new Node(planet.planetName, planet.planetNode);
    });

    const routeLinks = this.routes.map(route => {
      return new Link(
        route.planetOrigin,
        route.planetDestination,
        route.distance
      );
    });

    const graphNodes = {
      nodes: planetNodes.map(planetNode => ({
        name: planetNode.id,
        id: planetNode.name,
      })),
    };

    const graphLinks = {
      links: routeLinks.map(routeLink => ({
        source: routeLink.source,
        target: routeLink.target,
        value: routeLink.value,
      })),
    };

    const nodes = graphNodes.nodes.map(nodeItem => <Node>nodeItem);
    const links = graphLinks.links.map(linkItem => <Link>linkItem);

    const graph: Graph = <Graph>{ nodes, links };

    if (hasShortestRoute) {
      const sourceIndex = this.getNodeIndex(sourceValue, graph.nodes);
      const targetIndex = this.getNodeIndex(targetValue, graph.nodes);
      const routeResult = this.findRoute(sourceIndex, targetIndex, graph);
      drawTextPath(routeResult.path);
      drawGraph(routeResult.path);
    } else {
      drawGraph([]);
    }

    function drawTextPath(shortestPath) {
      const path = document.getElementsByClassName('path')[0];

      if (shortestPath && shortestPath.length > 0) {
        const source = shortestPath[0].source;
        const immediateTarget = shortestPath[0].target;
        const targets = shortestPath.map(item => item.target).slice(1, -1);
        const target = shortestPath[shortestPath.length - 1].target;
        const pathArray =
          shortestPath.length > 1
            ? [source, immediateTarget, ...targets, target]
            : [source, ...targets, target];
        path.innerHTML = pathArray.join(' -> ');
      } else {
        path.innerHTML = '';
      }
    }

    function drawGraph(shortestPath) {
      link = svg
        .selectAll('.link')
        .data(graph.links)
        .enter()
        .append('line')
        .attr('class', function(d) {
          return getLinkCssClass(d, shortestPath);
        });

      link.append('title').text(function(d) {
        return d.type;
      });

      edgepaths = svg
        .selectAll('.edgepath')
        .data(graph.links)
        .enter()
        .append('path')
        .attr('class', 'edgepath')
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .attr('id', function(d, i) {
          return 'edgepath' + i;
        })
        .style('pointer-events', 'none');

      edgelabels = svg
        .selectAll('.edgelabel')
        .data(graph.links)
        .enter()
        .append('text')
        .style('pointer-events', 'none')
        .attr('class', 'edgelabel')
        .attr('id', function(d, i) {
          return 'edgelabel' + i;
        })
        .attr('font-size', 14)
        .attr('padding', 5)
        .attr('fill', 'red');

      edgelabels
        .append('textPath')
        .attr('xlink:href', function(d, i) {
          return '#edgepath' + i;
        })
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .attr('startOffset', '50%')
        .text(function(d) {
          return d.type;
        });

      node = svg
        .selectAll('.node')
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(
          d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
        );

      node
        .append('circle')
        .attr('class', 'node')
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .attr('r', function(d) {
          return 15;
        })
        .style('fill', function(d, i) {
          return colors(i);
        });

      node
        .append('text')
        .attr('class', 'label')
        .attr('text-anchor', 'middle')
        .attr('y', '.3em')
        .text(function(d) {
          return d.id;
        });

      node.append('title').text(function(d) {
        return d.name;
      });

      simulation.nodes(graph.nodes).on('tick', ticked);
      simulation.force('link').links(graph.links);
    }

    function getLinkCssClass(currentLink, shortestPath) {
      const currentPath = shortestPath.find(
        path =>
          (path.source === currentLink.target &&
            path.target === currentLink.source) ||
          (path.source === currentLink.source &&
            path.target === currentLink.target)
      );

      if (currentPath !== undefined) {
        return 'link bold';
      }
      return 'link';
    }

    function ticked() {
      node
        .attr('cx', function(d) {
          return (d.x = Math.max(15, Math.min(width - 15, d.x)));
        })
        .attr('cy', function(d) {
          return (d.y = Math.max(15, Math.min(height - 15, d.y)));
        });

      link
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      node.attr('transform', function(d) {
        return `translate(${d.x},${d.y})`;
      });

      edgepaths.attr('d', function(d) {
        return `M ${d.source.x} ${d.source.y} ${d.target.x} ${d.target.y}`;
      });

      edgelabels.attr('transform', function(d) {
        if (d.target.x < d.source.x) {
          const bbox = this.getBBox();

          const rx = bbox.x + bbox.width / 2;
          const ry = bbox.y + bbox.height / 2;
          return `rotate(180 ${rx} ${ry})`;
        } else {
          return 'rotate(0)';
        }
      });
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
  }

  private getNodeIndex(key: string, nodes: Node[]) {
    return nodes.findIndex(node => node.id === key);
  }

  private findRoute(source: number, target: number, graph: Graph) {
    let distances = this.makeDistanceArrayFromNodes(graph);

    distances = this.populateDistances(graph, distances);

    return this.dijkstra(source, target, distances, graph);
  }

  private makeDistanceArrayFromNodes(graph) {
    const distances = [];

    for (let i = 0; i < graph.nodes.length; i++) {
      distances[i] = [];

      for (let j = 0; j < graph.nodes.length; j++) {
        distances[i][j] = 'x';
      }
    }

    return distances;
  }

  private populateDistances(graph, distances) {
    for (let i = 0; i < graph.links.length; i++) {
      const sourceIndex = this.getNodeIndex(graph.links[i].source, graph.nodes);
      const targetIndex = this.getNodeIndex(graph.links[i].target, graph.nodes);
      const distance = graph.links[i].value;

      distances[sourceIndex][targetIndex] = distance;
      distances[targetIndex][sourceIndex] = distance;
    }
    return distances;
  }

  private dijkstra(start, end, distances, graph) {
    const nodeCount = distances.length,
      infinity = 99999,
      shortestPath = new Array(nodeCount),
      nodeChecked = new Array(nodeCount),
      pred = new Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      shortestPath[i] = infinity;
      pred[i] = null;
      nodeChecked[i] = false;
    }

    shortestPath[start] = 0;

    for (let i = 0; i < nodeCount; i++) {
      let minDist = infinity;
      let closestNode = null;

      for (let j = 0; j < nodeCount; j++) {
        if (!nodeChecked[j]) {
          if (shortestPath[j] <= minDist) {
            minDist = shortestPath[j];
            closestNode = j;
          }
        }
      }

      nodeChecked[closestNode] = true;

      for (let k = 0; k < nodeCount; k++) {
        if (!nodeChecked[k]) {
          const nextDistance = distanceBetween(closestNode, k, distances);

          if (
            parseInt(shortestPath[closestNode], 10) +
              parseInt(nextDistance, 10) <
            parseInt(shortestPath[k], 10)
          ) {
            const soFar = parseInt(shortestPath[closestNode], 10);
            const extra = parseInt(nextDistance, 10);

            shortestPath[k] = soFar + extra;

            pred[k] = closestNode;
          }
        }
      }
    }

    if (shortestPath[end] < infinity) {
      const newPath = [];
      let step = { target: graph.nodes[end].id };

      let v = end;

      while (v >= 0) {
        v = pred[v];

        if (v !== null && v >= 0) {
          step['source'] = graph.nodes[v].id;
          newPath.unshift(step);
          step = { target: graph.nodes[v].id };
        }
      }

      const totalDistance = shortestPath[end];

      return {
        mesg: 'OK',
        path: newPath,
        source: start,
        target: end,
        distance: totalDistance,
      };
    } else {
      return {
        mesg: 'No path found',
        path: null,
        source: start,
        target: end,
        distance: 0,
      };
    }

    function distanceBetween(fromNode, toNode, currentDistances) {
      let dist = currentDistances[fromNode][toNode];

      if (dist === 'x') {
        dist = infinity;
      }

      return dist;
    }
  }
}
