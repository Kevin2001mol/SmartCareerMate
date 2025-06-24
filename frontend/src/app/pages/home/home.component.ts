import {
  Component, signal, computed, effect, inject,
} from '@angular/core';
import {
  FormsModule, FormBuilder, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { MatCardModule }         from '@angular/material/card';
import { MatDividerModule }      from '@angular/material/divider';
import { MatFormFieldModule }    from '@angular/material/form-field';
import { MatInputModule }        from '@angular/material/input';
import { MatSelectModule }       from '@angular/material/select';
import { MatButtonModule }       from '@angular/material/button';
import { MatIconModule }         from '@angular/material/icon';
import { MatProgressBarModule }  from '@angular/material/progress-bar';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector   : 'app-home',
  standalone : true,
  imports    : [
    // Angular
    FormsModule, ReactiveFormsModule, NgIf, NgFor,
    // Material
    MatCardModule, MatDividerModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatProgressBarModule,
  ],
  template: `
    <div class="grid gap-6 xl:grid-cols-2 p-4">

      <!-- ── 1. SUBIDA CV ─────────────────────────────────────────────── -->
      <mat-card class="h-full flex flex-col">
        <h2 class="text-lg font-semibold mb-2">1. Carga tu CV (PDF)</h2>

        <div
          class="flex-1 border-2 border-dashed rounded-lg p-6
                 flex items-center justify-center text-center
                 bg-gray-50 hover:bg-gray-100 transition"
          (dragover)="onDrag($event)" (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)">
          <div>
            <mat-icon class="text-4xl mb-2">upload_file</mat-icon>
            <p class="text-sm">
              Arrastra aquí tu PDF&nbsp;o&nbsp;
              <label class="text-primary cursor-pointer underline">
                selecciónalo
                <input type="file" accept="application/pdf" hidden
                       (change)="onFileSelect($event)">
              </label>
            </p>
          </div>
        </div>

        <ng-container *ngIf="cvFile()">
          <mat-divider class="my-4"></mat-divider>
          <p class="text-sm">
            <strong>Archivo:</strong> {{ cvFile()!.name }}
            <button mat-icon-button aria-label="Quitar"
                    (click)="removeFile()">
              <mat-icon>close</mat-icon>
            </button>
          </p>
        </ng-container>
      </mat-card>

      <!-- ── 2-4. FORMULARIO DETALLES VACANTE + OPCIONES ──────────────── -->
      <mat-card class="space-y-4">
        <h2 class="text-lg font-semibold">2. Datos de la oferta</h2>

        <form [formGroup]="form" class="space-y-4">

          <!-- Oferta -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Descripción / enlace de la vacante</mat-label>
            <textarea matInput rows="4" formControlName="offer"
                      placeholder="Pega aquí el texto de la oferta…"></textarea>
          </mat-form-field>

          <!-- Idioma y tono -->
          <div class="grid sm:grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Idioma</mat-label>
              <mat-select formControlName="lang">
                <mat-option value="es">Español</mat-option>
                <mat-option value="en">Inglés</mat-option>
                <mat-option value="fr">Francés</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tono</mat-label>
              <mat-select formControlName="tone">
                <mat-option value="formal">Formal</mat-option>
                <mat-option value="professional">Profesional</mat-option>
                <mat-option value="friendly">Cercano</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Nivel entrevista -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nivel (entrevista simulada)</mat-label>
            <mat-select formControlName="level">
              <mat-option value="junior">Junior</mat-option>
              <mat-option value="mid">Mid</mat-option>
              <mat-option value="senior">Senior</mat-option>
            </mat-select>
          </mat-form-field>

        </form>
      </mat-card>

      <!-- ── 5. SUGERENCIAS + GENERAR DOCS ────────────────────────────── -->
      <mat-card class="space-y-4">
        <h2 class="text-lg font-semibold">3. Sugerencias de mejora</h2>

        <div class="min-h-[6rem] border rounded p-4 text-sm text-gray-600"
             *ngIf="suggestions().length; else noSug">
          <ul class="list-disc pl-4">
            <li *ngFor="let s of suggestions()">{{ s }}</li>
          </ul>
        </div>
        <ng-template #noSug>
          <p class="text-gray-400 italic">Aún no hay sugerencias.</p>
        </ng-template>

        <button mat-raised-button color="primary" class="w-full"
                [disabled]="!form.valid || !cvFile()"
                (click)="onGenerate()">
          <mat-icon class="mr-2">auto_fix_high</mat-icon>
          Generar CV + carta
        </button>

        <mat-progress-bar *ngIf="loading()" mode="indeterminate"></mat-progress-bar>
      </mat-card>

      <!-- ── 6. CHATBOT (placeholder) ─────────────────────────────────── -->
      <mat-card class="col-span-full">
        <h2 class="text-lg font-semibold mb-2">4. Chat de entrevista</h2>

        <div class="h-64 overflow-y-auto border rounded p-3 mb-2">
          <!-- mensajes simulados -->
          <p class="text-gray-500 italic">[Aquí irán los mensajes IA]</p>
        </div>

        <div class="flex gap-2">
          <mat-form-field class="flex-1" appearance="outline">
            <input matInput placeholder="Escribe tu respuesta…" [(ngModel)]="chatInput">
          </mat-form-field>
          <button mat-icon-button color="primary">
            <mat-icon>send</mat-icon>
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`.mat-checkbox-layout { white-space: normal !important; }`]
})
export class HomeComponent {

  private fb = inject(FormBuilder);

  /**  drag-&-drop  **/
  cvFile   = signal<File|null>(null);
  onDrag(e: DragEvent){ e.preventDefault(); }
  onDragLeave(e: DragEvent){ e.preventDefault(); }
  onDrop(e: DragEvent){
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file?.type === 'application/pdf') this.cvFile.set(file);
  }
  onFileSelect(e: Event){
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file?.type === 'application/pdf') this.cvFile.set(file);
  }
  removeFile(){ this.cvFile.set(null); }

  /**  formulario  **/
  form = this.fb.group({
    offer : ['', Validators.required],
    lang  : ['es', Validators.required],
    tone  : ['professional', Validators.required],
    level : ['mid', Validators.required],
  });

  /**  Sugerencias dummy  */
  suggestions = signal<string[]>([]);
  loading     = signal(false);

  /**  Chat placeholder  */
  chatInput = '';

  /**  Generar  */
  onGenerate(){
    this.loading.set(true);

    // TODO: llamar a tu API Gateway (parser + IA).  Ejemplo simulado:
    setTimeout(() => {
      this.suggestions.set([
        'Destaca tu experiencia en React y Angular.',
        'Añade logros cuantificables (↑25 % rendimiento).',
        'Adapta la sección de habilidades al stack de la oferta.',
      ]);
      this.loading.set(false);
    }, 2000);
  }
}
