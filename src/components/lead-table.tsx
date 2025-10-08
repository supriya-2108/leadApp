"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { toast } from "sonner";

type Lead = {
  id: string
  name: string
  age: number
  city: string
  occupation: string
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Request failed: ${r.status}`)
    return r.json()
  })

export default function LeadsTable() {
 
  const { data, error, isLoading, mutate } = useSWR<Lead[]>("/api/leads", fetcher, {
    revalidateOnFocus: false,
  })

  // Add form state
  const [newLead, setNewLead] = useState({ name: "", age: "", city: "", occupation: "" })
  const canAdd = useMemo(() => {
    const ageNum = Number(newLead.age)
    return (
      newLead.name.trim() && newLead.city.trim() && newLead.occupation.trim() && Number.isFinite(ageNum) && ageNum > 0
    )
  }, [newLead])

  // Edit state per row
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLead, setEditLead] = useState({ name: "", age: "", city: "", occupation: "" })

  const onAdd = async () => {
    try {
      const body = {
        name: newLead.name.trim(),
        age: Number(newLead.age),
        city: newLead.city.trim(),
        occupation: newLead.occupation.trim(),
      }
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to add lead")
      setNewLead({ name: "", age: "", city: "", occupation: "" })
      await mutate()
      toast("Success", { description: "lead added" });
    } catch (e: any) {
        toast("Success", { description: e.message });
    }
  }

  const startEdit = (lead: Lead) => {
    setEditingId(lead.id)
    setEditLead({
      name: lead.name,
      age: String(lead.age),
      city: lead.city,
      occupation: lead.occupation,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditLead({ name: "", age: "", city: "", occupation: "" })
  }

  const saveEdit = async (id: string) => {
    try {
      const body = {
        name: editLead.name.trim(),
        age: Number(editLead.age),
        city: editLead.city.trim(),
        occupation: editLead.occupation.trim(),
      }
      if (!body.name || !body.city || !body.occupation || !Number.isFinite(body.age) || body.age <= 0) {
        throw new Error("Please provide valid name, age, city, and occupation.")
      }
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to update lead")
      await mutate()
      toast("error", { description: "Lead updated" });
      cancelEdit()
    } catch (e: any) {
        toast("Error", { description: e.message });
    }
  }

  const deleteLead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete lead")
      await mutate()
      toast("Success", { description: "Lead Deleted" });
    } catch (e: any) {
        toast("Error", { description: e.message });
    }
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-pretty">Leads</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Lead */}
        <div className="rounded-md border border-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="add-name" className="text-sm">
                Name
              </label>
              <Input
                id="add-name"
                value={newLead.name}
                onChange={(e) => setNewLead((s) => ({ ...s, name: e.target.value }))}
                placeholder="Jane Doe"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="add-age" className="text-sm">
                Age
              </label>
              <Input
                id="add-age"
                value={newLead.age}
                onChange={(e) => setNewLead((s) => ({ ...s, age: e.target.value }))}
                inputMode="numeric"
                placeholder="30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="add-city" className="text-sm">
                City
              </label>
              <Input
                id="add-city"
                value={newLead.city}
                onChange={(e) => setNewLead((s) => ({ ...s, city: e.target.value }))}
                placeholder="San Francisco"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="add-occupation" className="text-sm">
                Occupation
              </label>
              <Input
                id="add-occupation"
                value={newLead.occupation}
                onChange={(e) => setNewLead((s) => ({ ...s, occupation: e.target.value }))}
                placeholder="Engineer"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full md:w-auto" onClick={onAdd} disabled={!canAdd} aria-disabled={!canAdd}>
                Add Lead
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableCaption>Manage your leads. Add new leads, edit existing ones, or delete.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={5}>Failed to load leads</TableCell>
                </TableRow>
              )}
              {data?.length === 0 && !isLoading && !error && (
                <TableRow>
                  <TableCell colSpan={5}>No leads yet</TableCell>
                </TableRow>
              )}
              {data?.map((lead) => {
                const isEditing = editingId === lead.id
                return (
                  <TableRow key={lead.id}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editLead.name}
                          onChange={(e) => setEditLead((s) => ({ ...s, name: e.target.value }))}
                          aria-label={`Edit name for ${lead.name}`}
                        />
                      ) : (
                        lead.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editLead.age}
                          inputMode="numeric"
                          onChange={(e) => setEditLead((s) => ({ ...s, age: e.target.value }))}
                          aria-label={`Edit age for ${lead.name}`}
                        />
                      ) : (
                        lead.age
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editLead.city}
                          onChange={(e) => setEditLead((s) => ({ ...s, city: e.target.value }))}
                          aria-label={`Edit city for ${lead.name}`}
                        />
                      ) : (
                        lead.city
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editLead.occupation}
                          onChange={(e) => setEditLead((s) => ({ ...s, occupation: e.target.value }))}
                          aria-label={`Edit occupation for ${lead.name}`}
                        />
                      ) : (
                        lead.occupation
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" onClick={() => saveEdit(lead.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(lead)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteLead(lead.id)}
                            aria-label={`Delete ${lead.name}`}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
