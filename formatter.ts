// RUN FOR FORMATTING THE DATABASE RESULT ONLY
import data from "./db.json";

const getId = (a: { $oid: string }) => {
  return a.$oid;
};

const mapped = data.map((a) => {
  return {
    _id: getId(a._id),
    networkId: getId(a.networkId),
    siteId: getId(a.siteId),
    departmentId: getId(a.departmentId),
    workAreaId: getId(a.workAreaId),
    workAreaTitle: a.workarea.title,
    departmentTitle: a.department.title,
    title: a.title,
  };
});

Bun.write("formatted.json", JSON.stringify(mapped, null, 2));
