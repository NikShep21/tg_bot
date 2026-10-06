import sys
import networkx as nx

filename = sys.argv[1] if len(sys.argv) > 1 else "as20000102.txt"
graph = nx.read_edgelist(filename, nodetype=int, comments="#")
cycles = [cycle for cycle in nx.cycle_basis(graph) if len(cycle) >= 11]
if cycles:
    cycle = min(cycles, key=len)
    path = [cycle[0], *reversed(cycle[1:])]
    print(f"Direct edge: {cycle[0]}-{cycle[1]}")
    print(f"Alternative path ({len(path) - 1} edges): {'-'.join(map(str, path))}")
else:
    print("")
