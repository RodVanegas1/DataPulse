import { GeographyRepository } from '../repositories/geography.repository';

export class GeographyService {
  constructor(private readonly repository = new GeographyRepository()) {}

  getDepartments() {
    return this.repository.listDepartments();
  }

  getMunicipalities(departmentSlug?: string) {
    return this.repository.listMunicipalities(departmentSlug);
  }
}
