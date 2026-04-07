import { a as useNavigate, h as getTenantId, d as useQueryClient, r as reactExports, P as ProjectStatus, j as jsxRuntimeExports, B as Button, f as Link, F as FolderKanban } from "./index-D7inqmxR.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D0Yw2k_p.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { L as LoaderCircle } from "./loader-circle-CEvzFFjS.js";
import { S as Save } from "./save-gMXGM8pU.js";
import "./index-IXOTxK3N.js";
import "./index-BGFsRO7G.js";
import "./check-EW6vRiNm.js";
function ProjectNewPage() {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState(ProjectStatus.Active);
  const [membersInput, setMembersInput] = reactExports.useState("");
  const [nameError, setNameError] = reactExports.useState("");
  const createMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createProject(tenantId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects", tenantId] });
      ue.success("Project created successfully");
      navigate({
        to: "/app/projects/$projectId",
        params: { projectId: project.id }
      });
    },
    onError: (err) => {
      ue.error(err.message || "Failed to create project");
    }
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }
    setNameError("");
    const memberIds = membersInput.split(",").map((s) => s.trim()).filter(Boolean);
    createMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      memberIds
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          asChild: true,
          "aria-label": "Back to Projects",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/projects", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-orange-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "New Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Set up a new project for your team" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "rounded-2xl border border-border bg-card p-6 space-y-5",
        "data-ocid": "project-new-form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "project-name", children: [
              "Project Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "project-name",
                placeholder: "e.g. Q2 Marketing Campaign",
                value: name,
                onChange: (e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                },
                "data-ocid": "project-name-input",
                "aria-invalid": !!nameError
              }
            ),
            nameError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: nameError })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "project-desc", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "project-desc",
                placeholder: "Describe the project goals and scope...",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 4,
                "data-ocid": "project-desc-input",
                className: "resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "project-status", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: status,
                onValueChange: (v) => setStatus(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "project-status",
                      "data-ocid": "project-status-select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ProjectStatus.Active, children: "Active" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ProjectStatus.OnHold, children: "On Hold" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ProjectStatus.Completed, children: "Completed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ProjectStatus.Archived, children: "Archived" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "project-members", children: "Team Members" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "project-members",
                placeholder: "Enter principal IDs separated by commas",
                value: membersInput,
                onChange: (e) => setMembersInput(e.target.value),
                "data-ocid": "project-members-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Separate multiple member IDs with commas. You can add members later." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 pt-2 border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                asChild: true,
                "data-ocid": "project-cancel-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/projects", children: "Cancel" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                disabled: createMutation.isPending,
                className: "bg-orange-500 hover:bg-orange-600 text-white",
                "data-ocid": "project-save-btn",
                children: [
                  createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
                  "Create Project"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  ProjectNewPage as default
};
